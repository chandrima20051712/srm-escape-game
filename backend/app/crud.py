from datetime import datetime

from sqlalchemy import desc, func, select, text, update
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Puzzle, Score, User


async def get_user_by_username(db: AsyncSession, username: str) -> User | None:
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: int) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def create_user(
    db: AsyncSession,
    username: str,
    email: str,
    password_hash: str,
    is_admin: bool = False,
) -> User:
    user = User(username=username, email=email, password_hash=password_hash, is_admin=is_admin)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def update_reset_token(db: AsyncSession, email: str, token: str, expiry: datetime) -> None:
    await db.execute(
        update(User)
        .where(User.email == email)
        .values(reset_token=token, reset_token_expiry=expiry)
    )
    await db.commit()


async def reset_password(db: AsyncSession, email: str, password_hash: str) -> None:
    await db.execute(
        update(User)
        .where(User.email == email)
        .values(password_hash=password_hash, reset_token=None, reset_token_expiry=None)
    )
    await db.commit()


async def submit_score(
    db: AsyncSession,
    user_id: int,
    building_id: str,
    score: int,
    lives_remaining: int | None,
    time_taken: int | None,
) -> Score:
    row = Score(
        user_id=user_id,
        building_id=building_id,
        score=score,
        lives_remaining=lives_remaining,
        time_taken=time_taken,
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


async def get_user_scores(db: AsyncSession, user_id: int) -> list[dict]:
    query = text(
        """
        SELECT building_id, MAX(score) as best_score, COUNT(*) as attempts
        FROM scores
        WHERE user_id = :uid
        GROUP BY building_id
        """
    )
    result = await db.execute(query, {"uid": user_id})
    return [dict(row._mapping) for row in result]


async def get_user_best_score(db: AsyncSession, user_id: int, building_id: str) -> dict | None:
    query = text(
        """
        SELECT *
        FROM scores
        WHERE user_id = :uid AND building_id = :bid
        ORDER BY score DESC
        LIMIT 1
        """
    )
    result = await db.execute(query, {"uid": user_id, "bid": building_id})
    row = result.first()
    return dict(row._mapping) if row else None


async def get_leaderboard(db: AsyncSession, limit: int = 50) -> list[dict]:
    query = text(
        """
        SELECT
          u.id,
          u.username,
          COALESCE(SUM(s.score), 0) as total_score,
          COUNT(DISTINCT s.building_id) as buildings_completed,
          MAX(s.completed_at) as last_played
        FROM users u
        LEFT JOIN scores s ON u.id = s.user_id
        GROUP BY u.id, u.username
        ORDER BY total_score DESC, buildings_completed DESC
        LIMIT :lim
        """
    )
    result = await db.execute(query, {"lim": limit})
    return [dict(row._mapping) for row in result]


async def get_user_rank(db: AsyncSession, user_id: int) -> int | None:
    query = text(
        """
        SELECT rank FROM (
          SELECT
            u.id,
            ROW_NUMBER() OVER (
              ORDER BY COALESCE(SUM(s.score), 0) DESC, COUNT(DISTINCT s.building_id) DESC
            ) AS rank
          FROM users u
          LEFT JOIN scores s ON u.id = s.user_id
          GROUP BY u.id
        ) ranked
        WHERE id = :uid
        """
    )
    result = await db.execute(query, {"uid": user_id})
    row = result.first()
    return row._mapping["rank"] if row else None


async def get_puzzles_by_building(db: AsyncSession, building_id: str) -> list[Puzzle]:
    result = await db.execute(
        select(Puzzle).where(Puzzle.building_id == building_id).order_by(Puzzle.puzzle_order.asc())
    )
    return list(result.scalars())


async def get_puzzle_by_id(db: AsyncSession, puzzle_id: int) -> Puzzle | None:
    result = await db.execute(select(Puzzle).where(Puzzle.id == puzzle_id))
    return result.scalar_one_or_none()


async def create_puzzle(
    db: AsyncSession,
    building_id: str,
    puzzle_order: int,
    question: str,
    options: list,
    correct_answer: int,
    explanation: str | None,
    hint: str | None,
    time_limit: int,
    created_by: int | None,
) -> Puzzle:
    puzzle = Puzzle(
        building_id=building_id,
        puzzle_order=puzzle_order,
        question=question,
        options=options,
        correct_answer=correct_answer,
        explanation=explanation,
        hint=hint,
        time_limit=time_limit,
        created_by=created_by,
    )
    db.add(puzzle)
    await db.commit()
    await db.refresh(puzzle)
    return puzzle


async def update_puzzle(
    db: AsyncSession,
    puzzle_id: int,
    question: str,
    options: list,
    correct_answer: int,
    explanation: str | None,
    hint: str | None,
    time_limit: int,
) -> Puzzle | None:
    puzzle = await get_puzzle_by_id(db, puzzle_id)
    if not puzzle:
        return None

    puzzle.question = question
    puzzle.options = options
    puzzle.correct_answer = correct_answer
    puzzle.explanation = explanation
    puzzle.hint = hint
    puzzle.time_limit = time_limit
    await db.commit()
    await db.refresh(puzzle)
    return puzzle


async def delete_puzzle(db: AsyncSession, puzzle_id: int) -> None:
    puzzle = await get_puzzle_by_id(db, puzzle_id)
    if puzzle:
        await db.delete(puzzle)
        await db.commit()


async def get_admin_puzzles(db: AsyncSession, user_id: int) -> list[Puzzle]:
    result = await db.execute(
        select(Puzzle).where(Puzzle.created_by == user_id).order_by(Puzzle.building_id, Puzzle.puzzle_order)
    )
    return list(result.scalars())


async def get_all_puzzles(db: AsyncSession) -> list[Puzzle]:
    result = await db.execute(select(Puzzle).order_by(Puzzle.building_id, Puzzle.puzzle_order))
    return list(result.scalars())

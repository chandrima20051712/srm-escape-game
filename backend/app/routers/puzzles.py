from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from .. import crud, schemas
from ..core.database import get_db
from ..dependencies import get_current_admin

router = APIRouter(prefix="/api/puzzles", tags=["puzzles"])


def puzzle_to_dict(puzzle):
    return {
        "id": puzzle.id,
        "building_id": puzzle.building_id,
        "puzzle_order": puzzle.puzzle_order,
        "question": puzzle.question,
        "options": puzzle.options,
        "correct_answer": puzzle.correct_answer,
        "explanation": puzzle.explanation,
        "hint": puzzle.hint,
        "time_limit": puzzle.time_limit,
        "created_by": puzzle.created_by,
        "created_at": puzzle.created_at,
        "updated_at": puzzle.updated_at,
    }


@router.get("/building/{building_id}")
async def by_building(building_id: str, db: AsyncSession = Depends(get_db)):
    puzzles = await crud.get_puzzles_by_building(db, building_id)
    return [puzzle_to_dict(p) for p in puzzles]


@router.get("/{puzzle_id}")
async def get_one(puzzle_id: int, db: AsyncSession = Depends(get_db)):
    puzzle = await crud.get_puzzle_by_id(db, puzzle_id)
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")
    return puzzle_to_dict(puzzle)


@router.post("")
async def create(payload: schemas.PuzzleCreateRequest, current=Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    if (
        not payload.buildingId
        or payload.puzzleOrder is None
        or not payload.question
        or payload.options is None
        or payload.correctAnswer is None
    ):
        raise HTTPException(status_code=400, detail="Missing required fields")

    if payload.correctAnswer < 0 or payload.correctAnswer >= len(payload.options):
        raise HTTPException(status_code=400, detail=f"Correct answer index must be between 0 and {len(payload.options) - 1}")

    puzzle = await crud.create_puzzle(
        db,
        building_id=payload.buildingId,
        puzzle_order=payload.puzzleOrder,
        question=payload.question,
        options=payload.options,
        correct_answer=payload.correctAnswer,
        explanation=payload.explanation,
        hint=payload.hint,
        time_limit=payload.timeLimit or 30,
        created_by=int(current["id"]),
    )
    return puzzle_to_dict(puzzle)


@router.put("/{puzzle_id}")
async def update(puzzle_id: int, payload: schemas.PuzzleUpdateRequest, current=Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    existing = await crud.get_puzzle_by_id(db, puzzle_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    if payload.correctAnswer < 0 or payload.correctAnswer >= len(payload.options):
        raise HTTPException(status_code=400, detail=f"Correct answer index must be between 0 and {len(payload.options) - 1}")

    puzzle = await crud.update_puzzle(
        db,
        puzzle_id=puzzle_id,
        question=payload.question,
        options=payload.options,
        correct_answer=payload.correctAnswer,
        explanation=payload.explanation,
        hint=payload.hint,
        time_limit=payload.timeLimit or 30,
    )
    return puzzle_to_dict(puzzle)


@router.delete("/{puzzle_id}")
async def delete(puzzle_id: int, current=Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    existing = await crud.get_puzzle_by_id(db, puzzle_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    await crud.delete_puzzle(db, puzzle_id)
    return {"message": "Puzzle deleted"}


@router.get("")
async def admin_puzzles(current=Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    puzzles = await crud.get_all_puzzles(db)
    return [puzzle_to_dict(p) for p in puzzles]

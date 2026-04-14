import json
import subprocess
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from . import crud
from .models import Puzzle


def _load_puzzles_data_from_node(repo_root: Path) -> dict:
    script = "const data=require('./data/puzzles.js'); process.stdout.write(JSON.stringify(data));"
    proc = subprocess.run(
        ["node", "-e", script],
        cwd=str(repo_root),
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="strict",
    )
    return json.loads(proc.stdout)


async def seed_puzzles_if_empty(db: AsyncSession) -> None:
    count = await db.scalar(select(func.count()).select_from(Puzzle))
    if count and count > 0:
        return

    repo_root = Path(__file__).resolve().parents[2]
    puzzles_data = _load_puzzles_data_from_node(repo_root)

    for building_id in puzzles_data["buildingOrder"]:
        building = puzzles_data["buildings"][building_id]
        for index, puzzle in enumerate(building["puzzles"]):
            await crud.create_puzzle(
                db,
                building_id=building_id,
                puzzle_order=index + 1,
                question=puzzle["question"],
                options=puzzle["options"],
                correct_answer=puzzle["correct"],
                explanation=puzzle.get("explanation"),
                hint=puzzle.get("hint"),
                time_limit=puzzle.get("timeLimit", 60),
                created_by=None,
            )

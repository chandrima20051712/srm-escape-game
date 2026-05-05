from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from .. import crud
from ..core.database import get_db
from ..dependencies import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/players")
async def get_all_players(
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get list of all players with their progress summary. Admin only."""
    try:
        players = await crud.get_all_players(db)
        return {
            "count": len(players),
            "players": players,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch players: {str(e)}")


@router.get("/players/{player_id}")
async def get_player_progress(
    player_id: int,
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get detailed progress for a specific player. Admin only."""
    try:
        progress = await crud.get_player_progress(db, player_id)
        if not progress:
            raise HTTPException(status_code=404, detail="Player not found")
        return progress
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch player progress: {str(e)}")

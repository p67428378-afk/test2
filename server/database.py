from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from server.config import settings

# For SQLite, we need connect_args={"check_same_thread": False}
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Import models here to register them on Base.metadata
    import server.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models import Painting

    # Check if we already have paintings
    if db.query(Painting).count() == 0:
        paintings = [
            Painting(
                title="Abstract Cityscape",
                description="A vibrant abstract representation of a modern city skyline at dusk.",
                artist_name="Elena Rostova",
                image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuBtYslyPFrMXI18_Druyt1UnGNbwizh_V1w-216a932-qI2epfVpK16CBhWxUO39tCG1944DxQGNj0qlDiEw0c535iHPrUqiEnrBzJG4zCgQFff_l9Sq3A4jDfVYwyxC5J0b_yPRb2N9kwMnzV1G5oV4FKu-yzBco-RrQAD-13ww5D4PmPeRI9iux8soelSoQ3EPjEpxlimjw8xO_Kfac4ARmJiUMNj-O0sUiaDvletbsryoZIvXKgx8iGTYAD-up7UWXjmF0oMDg",
                dimensions="24x36 in",
                price=250.00,
                stock=5,
            ),
            Painting(
                title="Ocean Sunset",
                description="A serene view of the sun setting over a calm ocean with warm golden hues.",
                artist_name="Marcus Vance",
                image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuBBSmXArGXb9L4sc6dqvgYrikCsSQ8OKccUlG51mc149TtCBWqFJhOOEb90SH2RcyOnDLQtKJijTloAlQC-U5dTjovqqlMUAoH5Bxyk-gw7HVT5KIYUhh9kJE9r_c9bYETOSFwyxGpaFl9sV1kZZLNJ_xV7AKIgS_E1QE0SKoWBSCgSrcdl7sdGxlWwJvAVXO04jc-y4AuhYBdyWHWgor53zYZw6L11oAwQSxmz4Rg5IwDSoFsL-CY1Y6IkW4Cw03C4ZRVXR9lc5w",
                dimensions="18x24 in",
                price=180.00,
                stock=3,
            ),
            Painting(
                title="Whispering Pines",
                description="A misty forest of pine trees whispering in the wind.",
                artist_name="Sarah Jenkins",
                image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuCxs26VKZirCccySE7B5qnDzlL15kZPtLF85J-atN1yHFD3xOtYo4BBRk8UH39siA1tZSkMoxngJdtJ1xQq7LfNrJA0Y0yc2xxTBrvjMk1rQkBD3hfejGkm1I3ah20Pr-X5odJpMIub0znKqTz07IiJROvo7W3FA3vRa2sMIYNwWXd0i1D5VYT8l8FaCgooT6PDKol2wxfBYr2NS3_6c-H06l6apLuYq9at19nO38NydP9b8CaIyGoNKTaVhZIO0NPS3xc04mM3dA",
                dimensions="30x40 in",
                price=320.00,
                stock=2,
            ),
            Painting(
                title="Geometric Harmony",
                description="A minimalist composition of geometric shapes and balanced colors.",
                artist_name="Kenji Sato",
                image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuDerWok_tX8vnMahhYWoJzUJITyF5wNssbTWHvQ80CDjHNw-eOlUa7xnmJI_YQEa-78duzz-qIA5fcD0ZY7m31vrEMWlmI79Xka2ZV9WGcQINapxCWQzQShBkL77OGRjT92HIF1XHba50vys7DzgwUDlPZlxru4ZP1N7uSnPgv__Nn_6Wt-avltOHLF3lFtu7-b6I_-ix0sDPuo9sMkfj1nRNJi5Jp242r2S60RSjfivF9vKVAUEocpeOC3Pdk-Aa19oub7PDElGA",
                dimensions="16x20 in",
                price=150.00,
                stock=10,
            ),
        ]
        db.add_all(paintings)
        db.commit()

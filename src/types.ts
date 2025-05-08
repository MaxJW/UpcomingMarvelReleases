export interface MarvelRelease {
    title: string;
    release_date: string | null;
    runtime: string;
    poster: string;
    link: string;
}

export interface GroupedReleases {
    released: MarvelRelease[];
    upcoming: MarvelRelease[];
    latest: MarvelRelease | null;
}

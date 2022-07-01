//import fetch from 'node-fetch';

const ID_CONTINENT_AFRICA = 1;
const ID_CONTINENT_EUROPE = 2;
const ID_CONTINENT_ASIA = 3;
const ID_CONTINENT_SOUTH_AMERICA = 4;
const ID_CONTINENT_NORTH_AMERICA = 5;

/**
 * Retrieve the chapters and their targets
 * @returns The continents with next points to target
 */
export function prepareData() {
    return fetch('https://gdg.community.dev/api/chapter_region?chapters=true')
        .then((res) => res.json())
        .then((arrayContinents) => {
            for (let continentA of arrayContinents) {
                for (let chapterA of continentA.chapters) {
                    for (let continentB of arrayContinents) {
                        for (let chapterB of continentB.chapters) {
                            // We don't treat same chapter
                            if (chapterA.id === chapterB.id) {
                                continue;
                            }
                            // We only deal with some continents
                            if (!allowedContinent(continentA, continentB)) {
                                continue;
                            }

                            const longitudeA = chapterA.longitude;
                            const longitudeB = chapterB.longitude;

                            /**
                             * We only check points at the right of current point
                             */
                            // According to the continent we check rights points based on longitude delta
                            // If destination is less than start and destination is a positive number -> it's not on "the right"
                            if (
                                !isOnTheRight(
                                    continentA,
                                    continentB,
                                    longitudeA,
                                    longitudeB
                                )
                            ) {
                                continue;
                            }

                            // If we are on the same city
                            const distanceChapters = distance(
                                chapterA,
                                chapterB
                            );
                            if (distanceChapters === 0) {
                                continue;
                            }
                            if (chapterA.id === 36)
                                console.log(
                                    chapterA.id,
                                    chapterA.city,
                                    longitudeA,
                                    chapterB.id,
                                    chapterB.city,
                                    longitudeB,
                                    distanceChapters
                                );

                            if (!chapterA.targetChapters) {
                                chapterA.targetChapters = [];
                            }

                            // If the chapter is on an already target city (distance already register)
                            if (
                                chapterA.targetChapters.find(
                                    (chapter) =>
                                        chapter.distance === distanceChapters
                                )
                            ) {
                                continue;
                            }

                            // We first add the chapter as a potential target
                            // We will only keep the 10th closer of the chapter
                            chapterA.targetChapters.push({
                                targetChapter: chapterB,
                                distance: distanceChapters,
                            });
                        }
                    }
                    // After dealing with a chapter, we only keep the 10th closers chapter of each chapter
                    if (chapterA.targetChapters) {
                        const orderByDistance = chapterA.targetChapters.sort(
                            (targetChapterA, targetChapterB) =>
                                targetChapterA.distance -
                                targetChapterB.distance
                        );
                        chapterA.targetChapters = orderByDistance.slice(0, 10);
                    }
                }
            }
            return arrayContinents;
        });
}
/**
 * Check we have travel on the correct continent
 * EUROPE -> EUROPE OR AFRICA OR ASIA
 * AFRICA -> AFRICA OR EUROPE OR ASIA
 * ASIA -> ASIA OR NORTH AMERICA OR SOUTH AMERICA
 * NORTH_AMERICA -> NORTH AMERICA OR SOUTH AMERICA OR EUROPE
 * SOUTH AMERICA -> NORTH AMERICA OR SOUTH AMERICA OR EUROPE
 * @param {*} continentA
 * @param {*} continentB
 */
function allowedContinent(continentA, continentB) {
    switch (continentA.id) {
        case ID_CONTINENT_AFRICA:
            if (
                continentB.id === ID_CONTINENT_NORTH_AMERICA ||
                continentB.id === ID_CONTINENT_SOUTH_AMERICA
            ) {
                return false;
            }
            break;
        case ID_CONTINENT_EUROPE:
            if (
                continentB.id === ID_CONTINENT_NORTH_AMERICA ||
                continentB.id === ID_CONTINENT_SOUTH_AMERICA
            ) {
                return false;
            }
            break;
        case ID_CONTINENT_ASIA:
            if (
                continentB.id === ID_CONTINENT_EUROPE ||
                continentB.id === ID_CONTINENT_AFRICA
            ) {
                return false;
            }
            break;
        case ID_CONTINENT_NORTH_AMERICA:
            if (
                continentB.id === ID_CONTINENT_ASIA ||
                continentB.id === ID_CONTINENT_AFRICA
            ) {
                return false;
            }
            break;
        case ID_CONTINENT_SOUTH_AMERICA:
            if (
                continentB.id === ID_CONTINENT_ASIA ||
                continentB.id === ID_CONTINENT_AFRICA
            ) {
                return false;
            }
            break;
    }
    return true;
}

/**
 * Check if the longitude of point B is consider on the "right" of point A
 * @param {*} continentA
 * @param {*} continentB
 * @param {*} longitudeA
 * @param {*} longitudeB
 */
function isOnTheRight(continentA, continentB, longitudeA, longitudeB) {
    switch (continentA.id) {
        case ID_CONTINENT_EUROPE:
        case ID_CONTINENT_AFRICA:
        case ID_CONTINENT_NORTH_AMERICA:
        case ID_CONTINENT_SOUTH_AMERICA:
            if (longitudeB < longitudeA) {
                return false;
            }
            break;
        case ID_CONTINENT_ASIA:
            // Particular case for asia, we switch in latitude to 180 to latitude in america in -180->-60
            if (
                (longitudeB < longitudeA && longitudeA > 0 && longitudeB > 0) ||
                (longitudeB < longitudeA && longitudeA < 0) ||
                (longitudeA < 0 && longitudeB > 0)
            ) {
                return false;
            }
            break;
    }
    return true;
}

/*
 * Calculates the angle ABC (in radians)
 *
 * A first point, ex: {x: 0, y: 0}
 * C second point
 * B center point
 */
function find_angle(A, B, C) {
    var AB = Math.sqrt(
        Math.pow(B.latitude - A.latitude, 2) +
            Math.pow(B.longitude - A.longitude, 2)
    );
    var BC = Math.sqrt(
        Math.pow(B.latitude - C.latitude, 2) +
            Math.pow(B.longitude - C.longitude, 2)
    );
    var AC = Math.sqrt(
        Math.pow(C.latitude - A.latitude, 2) +
            Math.pow(C.longitude - A.longitude, 2)
    );
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
}

function distance(A, B) {
    var a = A.latitude + 90 - (B.latitude + 90);
    var b =
        (A.longitude < 0 ? 180 + (180 + A.longitude) : A.longitude) -
        (B.longitude < 0 ? 180 + (180 + B.longitude) : B.longitude);

    return Math.sqrt(a * a + b * b);
}

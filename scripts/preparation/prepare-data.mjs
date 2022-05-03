import fetch from 'node-fetch';

const ID_CONTINENT_AFRICA = 1;
const ID_CONTINENT_EUROPE = 2;
const ID_CONTINENT_ASIA = 3;
const ID_CONTINENT_SOUTH_AMERICA = 4;
const ID_CONTINENT_NORTH_AMERICA = 5;


fetch('https://gdg.community.dev/api/chapter_region?chapters=true')
    .then((res) => res.json())
    .then((arrayContinents) => {
        for (let continentA of arrayContinents){
            for (let chapterA of continentA.chapters){
                for (let continentB of arrayContinents){
                    for (let chapterB of continentB.chapters){
                        // We don't treat same chapter
                        if (chapterA.id === chapterB.id){
                            continue;
                        }
                        // We only deal with some continents
                        /**
                         * EUROPE -> EUROPE OR AFRICA OR ASIA
                         * AFRICA -> AFRICA OR EUROPE OR ASIA
                         * ASIA -> ASIA OR NORTH AMERICA OR SOUTH AMERICA
                         * NORTH_AMERICA -> NORTH AMERICA OR SOUTH AMERICA OR EUROPE
                         * SOUTH AMERICA -> NORTH AMERICA OR SOUTH AMERICA OR EUROPE
                         */
                        switch (continentA.id){
                            case ID_CONTINENT_AFRICA:
                                if (continentB.id === ID_CONTINENT_NORTH_AMERICA || continentB.id === ID_CONTINENT_SOUTH_AMERICA){
                                    continue;
                                }
                                break;
                            case ID_CONTINENT_EUROPE:
                                if (continentB.id === ID_CONTINENT_NORTH_AMERICA || continentB.id === ID_CONTINENT_SOUTH_AMERICA){
                                    continue;
                                }
                                break;
                            case ID_CONTINENT_ASIA:
                                if (continentB.id === ID_CONTINENT_EUROPE || continentB.id === ID_CONTINENT_AFRICA){
                                    continue;
                                }
                                break;
                            case ID_CONTINENT_NORTH_AMERICA:
                                if (continentB.id === ID_CONTINENT_ASIA || continentB.id === ID_CONTINENT_AFRICA){
                                    continue;
                                }
                                break;
                            case ID_CONTINENT_SOUTH_AMERICA:
                                if (continentB.id === ID_CONTINENT_ASIA || continentB.id === ID_CONTINENT_AFRICA){
                                    continue;
                                }
                                break;
                        }

                        const longitudeA = chapterA.longitude;
                        const longitudeB = chapterB.longitudeB;

                        if(continent.title === '')
                        /**
                         * We only check points at the right of current point
                         */
                    }
                }
            }

        }
        console.log(arrayContinents);
    });

/*
 * Calculates the angle ABC (in radians)
 *
 * A first point, ex: {x: 0, y: 0}
 * C second point
 * B center point
 */
function find_angle(A, B, C) {
    var AB = Math.sqrt(Math.pow(B.latitude - A.latitude, 2) + Math.pow(B.longitude - A.longitude, 2));
    var BC = Math.sqrt(Math.pow(B.latitude - C.latitude, 2) + Math.pow(B.longitude - C.longitude, 2));
    var AC = Math.sqrt(Math.pow(C.latitude - A.latitude, 2) + Math.pow(C.longitude - A.longitude, 2));
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
}

function distance(A, B){
    var a = A.latitude - B.latitude;
    var b = A.longitude - B.longitude;

    return Math.sqrt( a*a + b*b );
}
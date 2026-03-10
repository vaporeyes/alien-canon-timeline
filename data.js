// ABOUTME: Data module containing all Alien franchise timeline events
// ABOUTME: Includes films, games, comics, books, and short films with metadata

const timelineData = [
    // Early Events
    { id: 1, year: 2023, title: "Alien: Bloodlines", type: "book",
      description: "A novel exploring the early days of the Alien universe and the origins of various bloodlines that would shape the future." },

    // Prometheus Era
    { id: 2, year: 2089, title: "Peter Weyland TED Talk", type: "short",
      description: "Peter Weyland gives a TED talk about building gods and the future of humanity. This viral marketing piece sets up the Prometheus mission." },

    { id: 3, year: 2091, title: "Happy Birthday David (Prometheus Viral)", type: "short",
      description: "A promotional video showing David's activation and early interactions with Weyland, demonstrating his capabilities and unsettling nature." },

    { id: 4, year: 2093, title: "Prometheus", type: "film",
      description: "The crew of the Prometheus discovers the origins of humanity on LV-223, unleashing ancient horrors. Directed by Ridley Scott." },

    { id: 5, year: 2094, title: "Alien: Covenant - Prologue: The Crossing", type: "short",
      description: "David and Shaw's journey between Prometheus and Covenant, showing their arrival at the Engineer homeworld." },

    { id: 6, year: 2095, title: "Alien: David's Drawings", type: "book",
      description: "A collection of David's disturbing biological illustrations and experiments, documenting his obsession with creation." },

    // Covenant Era
    { id: 7, year: 2104, title: "Alien: Covenant - Prologue: Last Supper", type: "short",
      description: "The Covenant crew's final gathering before entering cryosleep, establishing their relationships and mission goals." },

    { id: 8, year: 2104, title: "Alien: Covenant - Prologue: Crew Messages", type: "short",
      description: "Personal messages from the Covenant colonists to their loved ones on Earth before departing." },

    { id: 9, year: 2104, title: "Alien: Covenant", type: "film",
      description: "The colony ship Covenant discovers David's horrific experiments on Paradise. The birth of the perfect organism begins." },

    { id: 10, year: 2104, title: "Alien: Covenant - Advent", type: "short",
      description: "David's transmission to Weyland-Yutani, revealing his experiments and the creation of the Xenomorph." },

    // Between Covenant and Alien
    { id: 11, year: 2111, title: "Aliens: Bishop", type: "book",
      description: "The story of the Bishop android line and its creator, exploring themes of artificial consciousness and humanity." },

    // Alien Era
    { id: 12, year: 2122, title: "Alien: Out of the Shadows", type: "book",
      description: "Ellen Ripley's previously unknown encounter between Alien and Aliens, involving a mining station and dormant Xenomorphs." },

    { id: 13, year: 2122, title: "Alien", type: "film",
      description: "The crew of the Nostromo encounters the perfect killing machine on LV-426. Directed by Ridley Scott. The film that started it all." },

    // Post-Alien, Pre-Aliens
    { id: 14, year: 2137, title: "Alien: Isolation", type: "game",
      description: "Amanda Ripley searches for her mother Ellen aboard Sevastopol Station, facing a relentless Xenomorph. Survival horror at its finest." },

    { id: 15, year: 2137, title: "Alien: Blackout", type: "game",
      description: "Amanda Ripley must guide a ship's crew to safety while trapped in a vent system with a Xenomorph. Mobile survival game." },

    { id: 16, year: 2142, title: "Alien: Romulus", type: "film",
      description: "A group of young colonists encounter Xenomorphs while scavenging a derelict space station. Directed by Fede Alvarez." },

    { id: 17, year: 2159, title: "Alien: River of Pain", type: "book",
      description: "The tragic story of the Hadley's Hope colony on LV-426 before the events of Aliens, including Newt's parents' fateful discovery." },

    // Aliens Era
    { id: 18, year: 2179, title: "Alien: Sea of Sorrows", type: "book",
      description: "A descendant of Ellen Ripley is drawn back to LV-426 centuries later, confronting both Xenomorphs and Weyland-Yutani." },

    { id: 19, year: 2179, title: "Aliens: Newt's Tale", type: "comic",
      description: "The fall of Hadley's Hope from Newt's perspective, showing how she survived alone before Ripley's arrival." },

    { id: 20, year: 2179, title: "Aliens: Stasis Interrupted", type: "game",
      description: "The story of Hicks' survival after Aliens, revealing what really happened aboard the Sulaco." },

    { id: 21, year: 2179, title: "Aliens", type: "film",
      description: "Ellen Ripley returns to LV-426 with Colonial Marines to face a Xenomorph hive. Directed by James Cameron. Action horror masterpiece." },

    { id: 22, year: 2179, title: "Aliens: Colonial Marines", type: "game",
      description: "Marines investigate the Sulaco and return to LV-426, facing Xenomorphs and Weyland-Yutani forces. Controversial FPS game." },

    { id: 23, year: 2179, title: "Aliens: Bug Hunt", type: "book",
      description: "An anthology of Colonial Marines stories, expanding the universe with tales of various Xenomorph encounters." },

    { id: 24, year: 2179, title: "Aliens: Fire and Stone", type: "comic",
      description: "Part of the Fire and Stone crossover, following survivors on LV-426 decades after Aliens." },

    { id: 25, year: 2179, title: "Alien 3", type: "film",
      description: "Ripley crashes on prison planet Fiorina 161 and faces a lone Xenomorph. Directed by David Fincher. Dark and controversial." },

    // Post-Alien 3
    { id: 26, year: 2180, title: "Aliens: Life and Death", type: "comic",
      description: "Colonial Marines encounter Engineers, Predators, and Xenomorphs in an epic crossover event." },

    { id: 27, year: 2181, title: "Aliens: Infiltrator", type: "book",
      description: "A synthetic infiltrator attempts to steal Xenomorph research from a secret Weyland-Yutani facility." },

    { id: 28, year: 2182, title: "Aliens: Rescue", type: "comic",
      description: "Amanda Ripley's continuing adventures after Alien: Isolation, now facing Colonial Marines and corporate conspiracies." },

    { id: 29, year: 2183, title: "William Gibson's Alien 3", type: "comic",
      description: "An adaptation of William Gibson's unused Alien 3 screenplay, featuring Hicks and Bishop in a Cold War-style conflict." },

    { id: 30, year: 2184, title: "Alien: Into Charybdis", type: "book",
      description: "Colonists on a remote world discover an ancient Xenomorph threat and must fight for survival." },

    { id: 31, year: 2192, title: "Aliens: Resistance", type: "comic",
      description: "Amanda Ripley and Zula Hendricks team up to expose Weyland-Yutani's Xenomorph experiments." },

    { id: 32, year: 2193, title: "Aliens: Phalanx", type: "book",
      description: "On a medieval-level world, humans fight Xenomorphs using ancient warfare tactics and no modern technology." },

    { id: 33, year: 2195, title: "Alien 3: The Unproduced Screenplay", type: "book",
      description: "William Gibson's original Alien 3 script in novel form, presenting an alternate timeline where Hicks and Bishop survive." },

    { id: 34, year: 2202, title: "Aliens: Dark Descent", type: "game",
      description: "A real-time tactics game where Colonial Marines fight a Xenomorph outbreak on Moon Lethe. Features permadeath and squad management." },

    { id: 35, year: 2219, title: "Aliens: Fire and Stone", type: "comic",
      description: "The conclusion of the Fire and Stone saga, revealing the fate of LV-426 and the black goo's evolution." },

    // Later Timeline
    { id: 36, year: 2295, title: "Aliens: The Original Years Omnibus Vol. 1", type: "comic",
      description: "Collection of classic Aliens comics from the original Dark Horse run, set after Aliens film." },

    { id: 37, year: 2295, title: "Aliens: The Original Years Omnibus Vol. 2", type: "comic",
      description: "Continuation of the classic comics collection, featuring Earth overrun by Xenomorphs." },

    // Resurrection Era
    { id: 38, year: 2379, title: "Alien: Resurrection", type: "film",
      description: "200 years later, Ripley is cloned along with the Alien Queen. Directed by Jean-Pierre Jeunet. Bizarre and divisive finale." },

    { id: 39, year: 2386, title: "Aliens vs. Predator: Requiem", type: "game",
      description: "Set after the film, players control Predators cleaning up Xenomorph infestations across the galaxy." },

    // Far Future
    { id: 40, year: 2493, title: "Aliens: Dust to Dust", type: "comic",
      description: "A boy must survive a Xenomorph outbreak on a colony world, facing both aliens and human threats." },

    { id: 41, year: 2497, title: "Alien: Colony War", type: "book",
      description: "Political tensions between colonies erupts when Xenomorphs are weaponized in an interstellar conflict." },

    { id: 42, year: 2692, title: "Alien: The Cold Forge", type: "book",
      description: "A dying scientist on a remote station attempts to weaponize Xenomorphs while hiding her true agenda from Weyland-Yutani." },

    { id: 43, year: 2692, title: "Alien: Prototype", type: "book",
      description: "Corporate espionage leads to a Xenomorph outbreak on a transport ship, with nowhere to run in deep space." }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = timelineData;
}

const fs = require('fs');
const content = fs.readFileSync('js/utils/smartParser.js', 'utf8');
const m = {};
eval(content.replace('export const SmartParser', 'm.SmartParser'));

const json = `{
  "match": {
    "date": "Sabtu, 21 Februari 2026",
    "time": "20:30",
    "status": "Finished",
    "venue": "Stadion Gelora Madura Ratu Pamelingan, Pamekasan",
    "home_team": {
      "name": "Madura United",
      "score": 2,
      "scorers": [
        "Junior Brandão 45+1'",
        "Mendonca 88'"
      ]
    },
    "away_team": {
      "name": "Arema",
      "score": 2,
      "scorers": [
        "Dalberto 47'",
        "Joel Vinícius 51'"
      ]
    }
  },
  "statistics": {
    "ball_possession": {
      "home": 54,
      "away": 46
    },
    "total_shots": {
      "home": 26,
      "away": 12
    },
    "shots_on_target": {
      "home": 11,
      "away": 4
    },
    "corner_kicks": {
      "home": 11,
      "away": 6
    },
    "yellow_cards": {
      "home": 1,
      "away": 3
    },
    "red_cards": {
      "home": 0,
      "away": 0
    }
  }
}`;

const result = m.SmartParser.parseJSON(json);
console.log(JSON.stringify(result, null, 2));

const expectedMatch = result.schema.matches[0];
const targetArray = result.schema.matches.map(m => ({
    home: m.home, away: m.away, homeLogo: '', awayLogo: '',
    homeScore: m.homeScore ?? '-', awayScore: m.awayScore ?? '-',
    time: m.time || '', date: m.date || '', venue: m.venue || '', channel: m.channel || '',
    homeScorers: m.homeScorers || '', awayScorers: m.awayScorers || '',
    stats: m.stats || [],
    homeLineup: m.homeLineup || [], awayLineup: m.awayLineup || []
}));

console.log("MAPPED TARGET ARRAY:", JSON.stringify(targetArray, null, 2));

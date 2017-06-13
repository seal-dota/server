var sql = require('pg-sql').sql

function getSteamUsers(db) {
  var select = sql`
  SELECT
    steam_id,
    name,
    avatar,
    solo_mmr,
    party_mmr
  FROM
    steam_user
  `
  return db.query(select).then(result => {
    return result.rows
  })
}

function getSteamUser(db, steamId) {
  var select = sql`
  SELECT
    steam_user.steam_id,
    steam_user.name,
    steam_user.avatar,
    steam_user.solo_mmr,
    steam_user.party_mmr
  FROM
    steam_user
  WHERE
    steam_user.steam_id = ${steamId}
  `
  return db.query(select).then(result => {
    return result.rows[0]
  })
}

function saveSteamUser(db, user) {
  var upsert = sql`
  INSERT INTO steam_user (
    steam_id,
    name,
    avatar,
    solo_mmr,
    party_mmr
  ) VALUES (
    ${user.id},
    ${user.name},
    ${user.avatar},
    ${user.solo_mmr},
    ${user.party_mmr}
  )
  ON CONFLICT (
    steam_id
  ) DO UPDATE SET (
    name,
    avatar,
    solo_mmr,
    party_mmr
  ) = (
    ${user.name},
    ${user.avatar},
    ${user.solo_mmr},
    ${user.party_mmr}
  )
  `
  return db.query(upsert)
}

function deleteSteamUser(db, id) {
  var query = sql`
  DELETE FROM
    steam_user
  WHERE
    steam_id = ${id}
  `
  return db.query(query)
}

module.exports = db => {
  return {
    getSteamUsers: getSteamUsers.bind(null, db),
    getSteamUser: getSteamUser.bind(null, db),
    saveSteamUser: saveSteamUser.bind(null, db),
    deleteSteamUser: deleteSteamUser.bind(null, db)
  }
}

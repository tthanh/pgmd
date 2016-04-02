function initDb(callback) {
    var conn = connect();
    if (conn) {
        //dropTable(conn);
        createTable(conn);
        callback(conn);
    }
}

function connect() {
    return window.openDatabase("madDiscovery", '', "madDiscovery", 2000000);
}

function createTable(conn) {
    conn.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS events(" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date TEXT, time TEXT, organizer TEXT, location TEXT, lat REAL, lng REAL)");
        tx.executeSql("CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, path TEXT, eid INTEGER)");
    }, onError);
}

function dropTable(conn) {
    conn.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS events");
        tx.executeSql("DROP TABLE IF EXISTS images");
    }, onError);
}

function insertEvent(conn, event, callback) {
    conn.transaction(function (tx) {
        tx.executeSql("INSERT INTO events(name, date, time, organizer, location, lat, lng) VALUES(?,?,?,?,?,?,?)",
            [event.name, event.date, event.time, event.organizer, event.location, event.lat, event.lng],
            function (tx, results) {
                event.id = results.insertId;
                callback(event);
            }, onError);
    }, onError);
}

function getEvent(conn, id, callback) {
    conn.transaction(function (tx) {
        tx.executeSql("SELECT * FROM events WHERE id = ?",
            [id],
            function (tx, results) {
                callback(results.rows.item(0));
            },
            onError);
    }, onError);
}

function updateEvent(conn, event, callback) {
    conn.transaction(function (tx) {
        tx.executeSql("UPDATE events SET name = ?, date = ?, time = ?, organizer = ?, location = ?, lat = ?, lng = ? WHERE id = ?",
            [event.name, event.date, event.time, event.organizer, event.location, event.lat, event.lng, event.id],
            callback(event),
            onError
        );
    });
}

function listEvent(conn, callback) {
    conn.transaction(function (tx) {
        tx.executeSql("SELECT * FROM events", [], function (tx, results) {
            var events = [];
            var total = results.rows.length;
            for (var i = 0; i < total; i++) {
                var row = results.rows.item(i);
                events.push(row);
            }
            callback(events);
        }, onError);
    }, onError);
}

function insertImage(conn, image, callback) {
    conn.transaction(function (tx) {
        tx.executeSql("INSERT INTO images(name, path, eid) VALUES (?,?,?)",
            [image.name, image.path, image.eid], function (tx, results) {
                callback(image);
            }, onError);
    }, onError);
}

function selectImageByEvent(conn, eid, callback) {
    conn.transaction(function (tx) {
        tx.executeSql("SELECT * FROM images WHERE eid = ?",
            [eid],
            function (tx, results) {
                var images = [];
                var total = results.rows.length;
                for (var i = 0; i < total; i++) {
                    images.push(results.rows.item(i));
                }
                callback(images);
            }, onError);
    }, onError);
}

function deleteImage(conn, id, callback) {
    conn.transaction(function (tx) {
        tx.executeSql("DELETE FROM images WHERE id = ?", [id], function (tx, results) {
            callback('success');
        }, onError);
    });
}
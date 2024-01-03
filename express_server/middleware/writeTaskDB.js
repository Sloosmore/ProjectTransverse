const fs = require('fs');
const path = require('path');
const uuid = require('uuid');


function record(prompt, uu_id) {
    let task_record = {
        'task_id' : uu_id,
        'thread_id' : null,
        'date_created' : new Date().toISOString(),
        'last_update' : new Date().toISOString(),
        'prompt': [prompt],
        'file' : null,
        'content' : null 
    };

    write_json(task_record);
}

function write_json(new_data, filename='fileRecords.json') {
    let script_dir = __dirname;
    let filepath = path.join(script_dir, '../db/', filename);

    fs.readFile(filepath, 'utf8', function(err, data) {
        if (err) throw err;
        let file_data = JSON.parse(data);
        file_data["records"].push(new_data);
        let jsonStr = JSON.stringify(file_data, null, 4);
        fs.writeFile(filepath, jsonStr, 'utf8', function(err) {
            if (err) throw err;
            console.log('JSON file has been saved.');
        });
    });
}

module.exports = record
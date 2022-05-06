//script settings
let settings = input.config({
    title: 'Create individual records from multiple attachments in a single attachment field',
    description: 'Creates 1 individual record in another table for each attachment in a multiple attachment field in the source table, and links the new records back to the source record.',
    items: [
        // Source table select
        input.config.table('tableSource', {
            label: 'Table with existing attachments'
        }),
        // Source table: Selected View
        input.config.view('selectedView', {
            label: 'View from the selected table',
            parentTable: 'tableSource',
        }),
        // Source table: Attachment field
        input.config.field('attachField', {
            parentTable: 'tableSource',
            label: 'Attachment field with multiple attachments to split into new table',
        }),
        // Destination table select
        input.config.table('tableDest', {
            label: 'Table to create new records in'
        }),
        // Destination table: Output field
        input.config.field('destinationField', {
            parentTable: 'tableDest',
            label: 'Attachment field in destination table',
         }),
        // Destination table: Linked record field (back to the Source table record)
        input.config.field('linkField', {
            parentTable: 'tableDest',
            label: 'Linked record field, links back to source table with the source record',
        }),
    ]
});
async function splitAttachments() {
	let { tableSource, attachField, selectedView, tableDest, destinationField, linkField } = settings;
    // Check selected fields
    if (attachField.type !== 'multipleAttachments') {
        output.text(`"${attachField.name}" is not an attachment field. Run the script again and select an attachment field.`);
        return;
    }
    if (linkField.type !== 'multipleRecordLinks') {
        output.text(`"${linkField.name}" is not an linked field. Run the script again and select a linked field.`);
        return;
    }
    // Loads the records and fields from the selections above
    let attachQuery = await selectedView.selectRecordsAsync();
    let  attachRecords = attachQuery.records;

    // Loops through qualified records and create new records in target table
    for (let i=0; i<attachRecords.length; i++){
        let attachments = attachRecords[i].getCellValue(attachField);
        if(attachments !== null){
            // Array for records with attachments and their info
            let attachmentInfo = []
            for(let l=0; l<attachments.length; l++){
                attachmentInfo.push({
                    fields: {
                        "filename": attachments[l].filename,
                        [destinationField.name]: [{url: attachments[l].url}],
                        [linkField.id]: [{id: attachRecords[i].id}]
                    }
                })
            }

             //Splits the action up in batches of 50
             while (attachmentInfo.length > 0){
                    await tableDest.createRecordsAsync(attachmentInfo.slice(0,50));
                    attachmentInfo = attachmentInfo.slice(50)
                }
        }
    }
}
await splitAttachments();
console.log('all done!')

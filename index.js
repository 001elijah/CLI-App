const { program } = require('commander');
const contacts = require('./contacts');

const invokeAction = async ({ action, id, name, email, phone }) => {
    switch (action) {
        case 'listContacts':
            const contactsList = await contacts.listContacts();
            console.log(contactsList);
            break;
        case 'getContactById':
            const contactById = await contacts.getContactById(id);
            console.log(contactById);
            break;
        case 'addContact':
            await contacts.addContact(name, email, String(phone));
            break;
        case 'removeContact':
            await contacts.removeContact(id);
            console.log('removed id:', id);
            break;
        default:
            console.log('Enter valid command (listContacts, getContactById, addContact, removeContact)');
            break;
    }
}

program
    .option('-a, --action, <type>')
    .option('-i, --id, <type>')
    .option('-n, --name, <type>')
    .option('-e, --email, <type>')
    .option('-p, --phone, <type>');

program.parse();
const options = program.opts();
invokeAction(options);
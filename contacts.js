const fs = require('fs').promises;
const path = require('path');
// const contactsPath = path.resolve(__dirname + '/db/', 'contacts.json'); // '/db/' не коректний варіант
const contactsPath = path.join(__dirname, path.normalize('db/contacts.json'));
const shortid = require('shortid');

async function listContacts() {
  try {
      const buffer = await fs.readFile(contactsPath);
      const contacts = buffer.toString();
      return JSON.parse(contacts);
  } catch (error) {
      console.log(error.message);
  }
}

async function getContactById(contactId) {
  try {
      const contacts = await listContacts();
      const contact = await contacts.find(contact => contact.id === contactId); // || null;
      if (contact === undefined) throw new Error('404 Not found'); // return null instead of error or undefined
      return contact;
  } catch (error) {
      console.log("\x1b[31m", error.message);
      return error.message;
  }
}

async function removeContact(contactId) { //зробити через splice і повертати id видаленого контакта
    if (await getContactById(contactId) === '404 Not found') return;
    try {
        const { name } = await getContactById(contactId);
        const contacts = await listContacts();
        const newContacts = contacts.filter(contact => contact.id !== contactId);
        await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
        console.log("\x1b[43m", `${name} has been removed from your contact list!`);
        return contactId;
    } catch (error) {
        console.log("\x1b[31m", error.message);
    }
}

async function addContact(name, email, phone) {
    try {
        const contacts = await listContacts();
        if (await contacts.find(contact => contact.name === name)) throw new Error(`${name} is already in your contact list!`);
        contacts.push({ id: shortid.generate(), name, email, phone });
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        console.log("\x1b[42m", `${name} has been added to your contact list!`);
        console.log("\x1b[46m", "Contact overview:", contacts[contacts.length - 1]);
  } catch (error) {
        console.log("\x1b[31m", error.message);
  }
}

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact
}

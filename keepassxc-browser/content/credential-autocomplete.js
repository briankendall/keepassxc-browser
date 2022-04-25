'use strict';

class CredentialAutocomplete extends Autocomplete {}
CredentialAutocomplete.prototype.click = async function(e) {
    if (!e.isTrusted) {
        return null;
    }

    e.stopPropagation();

    const field = this.autocompleteList.find(a => a === e.target);
    if (field) {
        await this.showList(field);
        this.updateSearch();
    }
    return null;
};

CredentialAutocomplete.prototype.itemClick = async function(e, input, uuid) {
    if (!e.isTrusted) {
        return null;
    }

    e.stopPropagation();

    const index = Array.prototype.indexOf.call(e.currentTarget.parentElement.childNodes, e.currentTarget);
    const usernameValue = e.target.getElementsByTagName('input')[0].value;
    await this.fillPassword(usernameValue, index, uuid);

    this.closeList();
    input.focus();
    return null;
};

CredentialAutocomplete.prototype.itemEnter = async function(index, elements) {
    const usernameValue = elements[index].value;
    this.fillPassword(usernameValue, index, elements[index].uuid);
    return null;
};

CredentialAutocomplete.prototype.fillPassword = async function(value, index, uuid) {
    const combination = await kpxcFields.getCombination(this.input);
    combination.loginId = index;

    await sendMessage('page_set_login_id', uuid);

    const manualFill = await sendMessage('page_get_manual_fill');
    await kpxcFill.fillInCredentials(combination, value, uuid, manualFill === ManualFill.PASSWORD);
    return null;
};

const kpxcUserAutocomplete = new CredentialAutocomplete();

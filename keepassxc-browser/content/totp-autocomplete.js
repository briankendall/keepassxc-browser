'use strict';

class TOTPAutocomplete extends Autocomplete {}
TOTPAutocomplete.prototype.click = async function(e, input) {
    if (!e.isTrusted) {
        return null;
    }

    await kpxc.updateTOTPList();
    this.showList(input, true);
    return null;
};

TOTPAutocomplete.prototype.itemClick = async function(e, input, uuid) {
    if (!e.isTrusted) {
        return null;
    }

    const index = Array.prototype.indexOf.call(e.currentTarget.parentElement.childNodes, e.currentTarget);
    await this.fillTotp(index, uuid, input);

    this.closeList();
    input.focus();
    return null;
};

TOTPAutocomplete.prototype.itemEnter = async function(index, elements) {
    this.fillTotp(index, elements[index].uuid);
    return null;
};

TOTPAutocomplete.prototype.fillTotp = async function(index, uuid, currentInput) {
    const combination = await kpxcFields.getCombination(this.input, 'totp')
                     || await kpxcFields.getCombination(this.input, 'totpInputs');
    if (combination) {
        combination.loginId = index;
    }

    kpxcFill.fillTOTPFromUuid(this.input || currentInput, uuid);
    return null;
};

const kpxcTOTPAutocomplete = new TOTPAutocomplete();

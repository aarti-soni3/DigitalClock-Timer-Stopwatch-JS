//#region Helper Functions

const getElementById = (id) => {
    return document.getElementById(id);
}

const setTextContentByID = (id, text) => {
    getElementById(id).textContent = text;
}

const getTextContentByID = (id) => {
    return getElementById(id).textContent;
}

const formatTime = (time) => {
    return time.toString().padStart(2, 0);

}

//#endregion

export { getElementById, setTextContentByID, getTextContentByID, formatTime };
function validateTask(name, description) {
    if (!name || !description) {
        alert('Both fields are required.');
        return false;
    }
    return true;
}
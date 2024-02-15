let employees = [];
let roles = [];
let selectedItem;
const listElement = document.querySelector('ul');
const formElement = document.querySelector('form');
const bDelete = document.querySelector('#btnDelete');
const bCancel = document.querySelector('#btnCancel');
const bSubmit = document.querySelector('#btnSubmit');

function selectItem(employee, li) {
    clearError();
    clearSelection();
    selectedItem = employee;
    li.classList.add("selected");
    formElement.name.value = employee.name;
    formElement.salary.valueAsNumber = employee.salary;
    formElement.role_id.value = employee.role_id;
    bDelete.style.display = "inline";
    bCancel.style.display = "inline";
    bSubmit.textContent = "Update"
}

function clearSelection() {
    clearError();
    selectedItem = undefined;
    const li = listElement.querySelector('.selected');

    if(li) {
        li.classList.remove('selected');
    }
    formElement.name.value = "";
    formElement.salary.value = "";
    formElement.role_id.value = "";
    bDelete.style.display = "none";
    bCancel.style.display = "none";
    bSubmit.textContent = "Create"
}

async function onSubmit(evt) {
    evt.preventDefault();
    const employeeData = {
        name: formElement.name.value,
        salary: formElement.salary.valueAsNumber,
        role_id: +formElement.role_id.value 
    };

    if (!employeeData.name || !employeeData.salary || !employeeData.role_id){
        showError("You Must Fill All Form Fields.");
    } else {
        if (selectedItem) {
            const updatedItem = await updateEmployee(selectedItem.id,employeeData);
            const i = employees.indexOf(selectedItem);
            employees[i] = updatedItem;
            renderData();
            selectItem(updatedItem, listElement.children[i]);
            listElement.lastChild.scrollIntoView();
        } else {
            const createdItem = await createEmployee(employeeData);
            employees.push(createdItem);
            renderData();
            selectItem(createdItem, listElement.lastChild);
            listElement.lastChild.scrollIntoView();
        }
    }
}

async function onDelete() {
    if (selectedItem) {
        await deleteEmployee(selectedItem.id);
        const i = employees.indexOf(selectedItem);
        employees.splice(i , 1);
        renderData();
        clearSelection();
    }
}

function renderData() {
    listElement.innerHTML = "";
    for (const employee of employees) {
        let role = roles.find((role) => role.id == employee.role_id);
        const li = document.createElement('li');
        const divName = document.createElement('div');
        divName.textContent = employee.name;
        const divRole = document.createElement('div');
        divRole.textContent = role.name;
        li.appendChild(divName);
        li.appendChild(divRole);
        listElement.appendChild(li);
        li.addEventListener("click", () => selectItem(employee, li));
    }
}

function renderRoles() {
    for (const role of roles) {
        const option = document.createElement('option');
        option.textContent = role.name;
        option.value = role.id;
        formElement.role_id.appendChild(option);
    }
}

function showError(message, error){
    document.querySelector('#errors').textContent = message;
    if (error){
        console.error(error);
    }
}

function clearError(){
    document.querySelector('#errors').textContent = "";   
}

async function init(){  
    [employees,roles] = await Promise.all([
        listEmployees(),
        listRoles()
    ]);
    renderRoles();
    renderData();
    clearSelection();
    bCancel.addEventListener("click", clearSelection);
    formElement.addEventListener("submit", onSubmit);
    bDelete.addEventListener("click", onDelete);    
}

init();
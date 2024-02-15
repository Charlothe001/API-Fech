function renderTable(employees,roles) {
    //Transforma um array de objetos em array de strings
    let rows = employees.map((employee) => {
        let role = roles.find((role) => role.id == employee.role_id);
        return `<tr><td>${employee.id}</td><td>${employee.name}</td><td>${role.name}</td></tr>`
    })
    return `<table>${rows.join("")}</table>`;
}

function fetchJson(url){
    return fetch(url).then((r) => {
        if(r.ok){
            return r.json();
        }else{
            throw new Error(r.statusText);
        }
    });
}

function showError(e){
    document.querySelector('#app').innerHTML = "Erro ao carregar dados.";
    console.error(e);
}

function soluction_1(){
    // Requisição da lista de Funcionarios ao backend com retorno da chama emcapsulada em uma promise
    let employeesPromise = fetch("http://localhost:3000/employees");
    employeesPromise.then((r1) => {
        r1.json().then((employees) => {
            let rolesPromise = fetch("http://localhost:3000/roles");
            rolesPromise
            .then((r2) => {
                r2.json()
                .then(roles => {
                    let table = renderTable(employees,roles);
                    document.querySelector('#app').innerHTML = table;
                });
            });        
        });
    });    
}

function soluction_2(){    
    fetchJson("http://localhost:3000/employees")
    .then((employees) => {
        fetchJson("http://localhost:3000/roles")
        .then((roles) => {
            let table = renderTable(employees,roles);
            document.querySelector('#app').innerHTML = table;
        }).catch(showError());
    }).catch(showError());     
}

function soluction_3(){
    Promise.all([
        fetchJson("http://localhost:3000/employees"),
        fetchJson("http://localhost:3000/roles")])
        .then(([employees,roles]) => {
        let table = renderTable(employees,roles);
        document.querySelector('#app').innerHTML = table;
    })
    .catch(showError())
    .finally(() => {
        console.log("Carregou!");
    });
}

async function soluction_4(){
    try {
        let employees = await fetchJson("http://localhost:3000/employees");
        let roles = await fetchJson("http://localhost:3000/roles");
        let table = renderTable(employees,roles);
                document.querySelector('#app').innerHTML = table;
    } catch(e){
        showError(e);
    }
}

async function soluction_5(){
    try {
        let [employees,roles] = await Promise.all([
            fetchJson("http://localhost:3000/employees"),
            fetchJson("http://localhost:3000/roles")
        ]);
        let table = renderTable(employees,roles);
        document.querySelector('#app').innerHTML = table;
    } catch (e){
        showError(e);
    } finally {
        console.log("Carregou!")
    }    
}

soluction_2();
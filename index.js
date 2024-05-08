const express = require('express');
const { Pool } = require('pg');
const inquirer = require('inquirer');



// Connect to database
const pool = new Pool({
  // TODO: Enter PostgreSQL username
  user: 'postgres',
  // TODO: Enter PostgreSQL password
  password: 'your password',
  host: 'localhost',
  port: 5432,
  database: 'employees'
});

function run() {
    inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Exit']
        })  
        .then(({ action }) => {
            switch (action) {
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Exit':
                    pool.end();
                    break;
            }
        });
}

function viewDepartments() {
    pool.query('SELECT * FROM department',function(err, {rows}) {
        if(err){
            throw err;
        }
        console.table(rows);
        return run();
    });
}

function addDepartment() {
    inquirer
        .prompt({
            type: 'input',
            message: 'What is the name of the department?',
            name: 'departmentName'
        })
        .then((answer)=>{
                console.log(answer.departmentName)

                //INSERT INTO department (name) VALUES ('${answer.departmentName})')
    
                let queryCall = `INSERT INTO department (name) VALUES ('${answer.departmentName}')`
                pool.query(queryCall, function(err, results){
                    if(err){
                        throw err;
                    }
                    console.log('Department added!')
                    return run();
                })
        })

}

function viewRoles() {
   
    pool.query('SELECT title, salary, department.name AS department FROM role JOIN department ON role.department_id = department.id', function(err, { rows }) {
       
      if (err) throw err;
    
    console.table(rows);
        return run();
    });
}

function addRole() 
{
    pool.query('SELECT name, id FROM department', function(err, { rows }) {
        const departments = rows;
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'What is the title of the role?',
                    name: 'title'
                },
                {
                    type: 'input',
                    message: 'What is the salary of the role?',
                    name: 'salary'
                },
                {
                    type: 'list',
                    message: 'What department does the role belong to?',
                    name: 'department',
                    choices: departments
                }
            ])
            .then(({ title, salary, department }) => {
                const departmentId = departments.find(row => row.name === department).id;
                pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId], function(err) {
                    if (err) throw err;
                    console.log('Role added!');
                    return run();
                });
            });
    });
}
    

function updateEmployeeRole() {
    pool.query('SELECT first_name, last_name, id FROM employee', function(err, { rows }) {
        const employees = rows;
        pool.query('SELECT title, id FROM role', function(err, { rows }) {
            const roles = rows;
            inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'Which employee would you like to update?',
                        name: 'employee',
                        choices: employees.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row }))
                    },
                    {
                        type: 'list',
                        message: 'What is the employee\'s new role?',
                        name: 'role',
                        choices : roles.map(row => row.title)
                        
                    }
                ])
                .then(({ employee, role }) => {
                    const employeeId = employees.find(row => row.first_name === employee.first_name && row.last_name === employee.last_name).id;
                    const roleId = roles.find(row => row.title === role).id;
                    pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId], function(err) {
                        if (err) throw err;
                        console.log('Employee role updated!');
                        return run();
                    });
                });
        });
    });


}
function viewEmployees() {
    pool.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', function(err, { rows }) {
        if (err) throw err;
        console.table(rows);
        return run();
    });
}

function addEmployee() {
    pool.query('SELECT title, role.id FROM role', function(err, { rows }) {
        const roles = rows;
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'What is the employee\'s first name?',
                    name: 'firstName'
                },
                {
                    type: 'input',
                    message: 'What is the employee\'s last name?',
                    name: 'lastName'
                },
                {
                    type: 'list',
                    message: 'What is the employee\'s role?',
                    name: 'role',
                    choices: roles.map(row => row.title)
                   
                }
            ])
            .then(({ firstName, lastName, role }) => {
            const roleId = roles.find(row => row.title === role).id;
                pool.query('INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3)', [firstName, lastName, roleId], function(err) {
                    if (err) throw err;
                    console.log('Employee added!');
                    return run();
                });
            });
    });
}

run();
INSERT INTO department (name)
VALUES
    ('Front_End'),
    ('Financial'),
    ('Legality'),
    ('Back_End');



INSERT INTO position (title, salary, department_id)
VALUES
    ('Sales Lead', 2000, 1),
    ('Salesperson', 3000, 2),
    ('Lead Engineer', 4000, 3),
    ('Software Engineer', 5000, 4),
    ('Accountant', 6000, 1),
    ('Legal Team Lead', 7000, 2),
    ('Lawyer', 8000, 3);


 
 INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Luis', 'Lopez', 5,NULL),
    ('John', 'Doe', 1,3 ),
    ('Jane', 'Doe', 3, NULL),
    ('Alice', 'Johnson', 6, 2),
    ('Bob', 'Smith', 5, NULL),
    ('Karen', 'Williams', 5, NULL),
    ('Kattie', 'Smith', 2, 1);

SELECT * FROM department;
SELECT * FROM position;
SELECT * FROM employee;

SELECT title, salary, employee.first_name, employee.last_name || ' ' ||, employee.name, manager.first_name || ' ' || manager.last_name 
AS manager FROM employee 
JOIN employee manager ON employee.manager_id = manager.id
JOIN role ON employee.role_id = role.id;
  
DROP DATABASE employees;

CREATE DATABASE employees;

\c employees;


CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE position (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON DELETE CASCADE 
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  position_id INTEGER NOT NULL,
  FOREIGN KEY (position_id)
        REFERENCES role(id)
        ON DELETE CASCADE,
manager_id INTEGER,
  FOREIGN KEY (manager_id)
        REFERENCES employee(id)
        ON DELETE SET NULL

 
);
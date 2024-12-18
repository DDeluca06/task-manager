CREATE DATABASE IF NOT EXISTS `task_manager` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `task_manager`;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description MEDIUMTEXT,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    startDate DATE,
    dueDate DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* Adding Indexes to potential hot-spot searches */ 
CREATE INDEX idx_title ON tasks(title);
CREATE INDEX idx_status ON tasks(status);
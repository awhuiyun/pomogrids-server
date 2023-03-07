CREATE DATABASE pomogrids;
USE pomogrids;

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    tier VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    target_num_of_sessions SMALLINT NOT NULL,
    is_archived BOOLEAN NOT NULL,
    category_name VARCHAR(255),
    category_colour VARCHAR(255),
    user_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE tasks_sessions (
    session_id SMALLINT PRIMARY KEY AUTO_INCREMENT,
    task_id VARCHAR(255) NOT NULL,
    number_of_sessions SMALLINT NOT NULL,
    number_of_minutes SMALLINT NOT NULL,
    date_of_session VARCHAR(45) NOT NULL,
    CONSTRAINT fk_tasks FOREIGN KEY(task_id) REFERENCES tasks(id)
);

CREATE TABLE settings (
    user_id VARCHAR(255) NOT NULL,
    pomodoro_minutes SMALLINT NOT NULL, 
    short_break_minutes SMALLINT NOT NULL, 
    long_break_minutes SMALLINT NOT NULL, 
    number_of_sessions_in_a_cycle SMALLINT NOT NULL, 
    alarm_ringtone VARCHAR(255) NOT NULL,
    alarm_volume DECIMAL(2, 1) NOT NULL,
    week_start VARCHAR(45) NOT NULL,
    CONSTRAINT fk_users_settings FOREIGN KEY(user_id) REFERENCES users(id)
);


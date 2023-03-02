CREATE DATABASE pomogrids;
USE pomogrids;

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    tier VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id SMALLINT PRIMARY KEY AUTO_INCREMENT,
    task_name VARCHAR(255) NOT NULL,
    target_num_of_sessions SMALLINT NOT NULL,
    category_name VARCHAR(255),
    category_colour VARCHAR(255),
    user_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE tasks_sessions (
    session_id SMALLINT PRIMARY KEY AUTO_INCREMENT,
    task_id SMALLINT NOT NULL,
    number_of_sessions SMALLINT NOT NULL,
    number_of_minutes SMALLINT NOT NULL,
    date_of_session STRING NOT NULL,
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
    CONSTRAINT fk_users_settings FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO users (id, email, tier) VALUES (UUID(), 'awhuiyun@gmail.com', 'basic');
INSERT INTO users (id, email, tier) VALUES (UUID(), 'raymoay@gmail.com', 'premium');

INSERT INTO tasks (task_name, target_num_of_sessions, completed_num_of_sessions, is_completed, user_id) VALUES ("Learn typescript and MySQL", 5, 2, false, "ca00d32a-b740-11ed-8877-0242ac110002")
INSERT INTO tasks (task_name, target_num_of_sessions, completed_num_of_sessions, is_completed, user_id) VALUES ("Build todogrids", 3, 2, false, "ca01723a-b740-11ed-8877-0242ac110002")

INSERT INTO tasks_sessions (task_id, number_of_sessions, number_of_minutes) VALUES (1, 2, 120);
INSERT INTO tasks_sessions (task_id, number_of_sessions, number_of_minutes) VALUES (3, 2, 180);

INSERT INTO settings (user_id, pomodoro_minutes, short_break_minutes, long_break_minutes, number_of_sessions_in_a_cycle, alarm_ringtone, alarm_volume) VALUES ("ca00d32a-b740-11ed-8877-0242ac110002", 25, 5, 15, 4, "default", 0.5);
INSERT INTO settings (user_id, pomodoro_minutes, short_break_minutes, long_break_minutes, number_of_sessions_in_a_cycle, alarm_ringtone, alarm_volume) VALUES ("ca01723a-b740-11ed-8877-0242ac110002", 25, 5, 15, 4, "default", 0.5);
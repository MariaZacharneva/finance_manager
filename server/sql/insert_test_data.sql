INSERT INTO users(name, email)
VALUES ('MASHA', 'masha@gmail.com');

-- masha's data
INSERT INTO groups(description, user_id)
VALUES ('group1', 1);
INSERT INTO categories(description, group_id)
VALUES ('category0', 1);
INSERT INTO spendings(user_id, description, value, currency, date)
VALUES (1, 'spending0', 13, 'USD', extract(epoch FROM now()) * 1000);
INSERT INTO spendings_to_categories(spending_id, category_id, group_id)
VALUES (1, 1, 1);


INSERT INTO users(name, email)
VALUES ('ANDREW', 'andrew@gmail.com');

-- andrew's data
INSERT INTO groups(description, user_id)
VALUES ('group1', 2);
INSERT INTO categories(description, group_id)
VALUES ('category1', 2);
INSERT INTO spendings(user_id, description, value, currency, date)
VALUES (2, 'spending1', 13, 'USD', extract(epoch FROM now()) * 1000);
INSERT INTO spendings_to_categories(spending_id, category_id, group_id)
VALUES (2, 2, 2);

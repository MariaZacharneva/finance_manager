 DROP TABLE IF EXISTS init_table;
 CREATE TABLE init_table
 (
    id bigserial PRIMARY KEY,
    text_message varchar(100)
 );

 INSERT INTO init_table (text_message) VALUES ('first message');
 INSERT INTO init_table (text_message) VALUES ('second message');


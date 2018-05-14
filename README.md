DDL Extension for StarUML
=========================

This extension for StarUML (http://staruml.io) support to generate DDL (Data Definition Language) from ERD. Install this extension from Extension Manager of StarUML.

How to use
----------

1. Click the menu (`Tools > DDL > Generate DDL...`)
2. Select a data model that will be generated to DDL.
3. Save the generated DDL to a file.

Generation rules
----------------

Belows are the rules to convert from ERD elements to DDL.

* All entities and columns are converted to create table statements as follow:

```sql
CREATE TABLE entity1 (
    col1 INTEGER,
    col2 VARCHAR(20),
    ...
);
```

* Primary keys are converted as follow:

```sql
CREATE TABLE entity1 (
    pk1 INTEGER,
    pk2 VARCHAR(10),
    ...
    PRIMARY KEY (pk1, pk2, ...)
);
```

* Not-nullable columns are converted as follow:

```sql
CREATE TABLE entity1 (
    col1 VARCHAR(20) NOT NULL,
    ...
);
```

* Unique columns are converted as follow:

```sql
CREATE TABLE entity1 (
    ...
    UNIQUE (col1, col2, ...)
);
```

* Foreign keys are converted as follow:

```sql
CREATE TABLE entity1 (
    fk1 INTEGER,
    ...
);
...

ALTER TABLE entity1 ADD FOREIGN KEY (fk1) REFERENCES entity2(col1);
```

* If `Quote Identifiers` option is selected, all identifiers will be surrounded by a backquote character.

```sql
CREATE TABLE `entity1` (
    `col1` INTEGER,
    `col2` VARCHAR(20),
    ...
);
```

* If `Drop Tables` option is selected, drop table statements will be included.

(__MySQL__ selected in `DBMS` option)
```sql
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS entity1;
...
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE entity1 (...);
...
```

(__Oracle__ selected in `DBMS` option)
```sql
DROP TABLE entity1 CASCADE CONSTRAINTS;`
...

CREATE TABLE entity1 (...);
...
```


Contributions
-------------

Any contributions are welcome. If you find a bug or have a suggestion, please post as an issue.

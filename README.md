DDL Extension for StarUML 2
===========================

This extension for StarUML(http://staruml.io) support to generate DDL (Data Definition Language) from ERD. Install this extension from Extension Manager of StarUML.

DDL Generation
--------------

1. Click the menu (`Tools > DDL > Generate DDL...`)
2. Select a data model that will be generated to DDL.
3. Save the generated DDL to a file.

Belows are the rules to convert from ERD elements to DDL.

### ERDEntity

* converted to a Table - `CREATE TABLE <name> (...)`.

### ERDColumn

* converted to a Column - `<name> <type>`.

Options
-------

### DDL file extension

### Drop table before create

### Quote identifier

### Generate comments

# Jeu TicTacToe

### Project requirements
- Python version: **== 3.11^**
- Run the following  command to install the project dependencies
```
pip install -r requirements.txt
```

### Run project
To start the project, run the following command
```
cd PATH_TO/django-tictactoe
```

```
python manage.py runserver
```

Open your browser and enter the url : `http://127.0.0.1:8000`. Check the port in your cmd; if not the same as 8000 then change accordingly.

### NOTE
The project is built with sass for css styling. Check this url for more information `https://sass-lang.com/documentation/`

#### How to install sass
```
npm install -g sass
```

Note that the css rules are located in /static/scss/  and compiled back to /static/css/styles.css. The following 
command show how to compile a sass code to css. You should be placed at the /static directory before running the command
```
sass --watch scss/styles.scss:css/style.css
```
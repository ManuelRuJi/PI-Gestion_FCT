# PI Gestion_FCT

Proyecto destinado a facilitar la gestión de las candidaturas de los alumnos para realizar la FCT, por parte de los docentes encargados de coordinar esta actividad.

## Requisitos

Para utilizar este proyecto necesitaremos una serie de herramientas:
- XAMP --> Lo utilizaremos por su BBDD MySQL que debera tener cargadas las migraciones de Laravel.
- Composer --> lo utilizaremos para iniciar la parte del back con Laravel (comando 'php artisa serve')
- Angular CLI --> Lo utilizaremos para iniciar la parte del front con Angular (comando 'ng serve')

## Uso

iniciamos el modulo de MySQL de XAMP

Dentro de la ruta API/GFCT_API ejecutamos

```bash
php artisa serve
```
Dentro de la ruta Front(Angular)/GFCT_Front ejecutamos

```bash
ng serve
```
Al hacerlo se ejecutara el proyecto en http://localhost:4200/.

## Roadmap

Para las siguientes versiones tendremos las siguientes nuevas Caracteristicas:

- Mayor estilo CSS (aunque seguiria siendo minimalista).
- implementar editar el profesor de seguimiento.
- Rework completo de como se ve y funciona la seccion de sedes.
- Añadir filtros para buscar los datos en cada sección

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)
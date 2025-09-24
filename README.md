<div align="center">

# 📚 Glosario Moderno

*Una aplicación web moderna para organizar y gestionar términos y definiciones*

[![GitHub stars](https://img.shields.io/github/stars/KalanOne/Glosario?style=for-the-badge&logo=github&color=yellow)](https://github.com/KalanOne/Glosario/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/KalanOne/Glosario?style=for-the-badge&logo=github&color=blue)](https://github.com/KalanOne/Glosario/network)
[![GitHub issues](https://img.shields.io/github/issues/KalanOne/Glosario?style=for-the-badge&logo=github&color=red)](https://github.com/KalanOne/Glosario/issues)
[![GitHub license](https://img.shields.io/github/license/KalanOne/Glosario?style=for-the-badge&logo=github&color=green)](https://github.com/KalanOne/Glosario/blob/main/LICENSE)

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16.2-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[🚀 Demo en Vivo](#) • [📖 Documentación](#características) • [🐛 Reportar Bug](https://github.com/KalanOne/Glosario/issues) • [✨ Solicitar Feature](https://github.com/KalanOne/Glosario/issues)

</div>

---

## ✨ Características

🔍 **Búsqueda Avanzada**
- Búsqueda en tiempo real por título, contenido o etiquetas
- Filtros personalizables por tipo de contenido
- Ordenamiento por fecha o alfabético

📝 **Gestión de Términos**
- Crear, editar y eliminar términos fácilmente
- Sistema de etiquetas para mejor organización
- Interfaz intuitiva con modales elegantes

🎨 **Diseño Moderno**
- Interfaz responsive y atractiva
- Gradientes y animaciones suaves
- Tema claro optimizado para lectura

📊 **Paginación Inteligente**
- Navegación eficiente entre páginas
- Control de elementos por página
- Estadísticas de resultados

🚀 **Tecnología Moderna**
- Next.js 15 con App Router
- Base de datos SQLite con Prisma ORM
- TypeScript para mayor seguridad
- Tailwind CSS para estilos

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15.5.4 | Framework React full-stack |
| **React** | 19.1.0 | Biblioteca de interfaz de usuario |
| **TypeScript** | 5.0 | Tipado estático |
| **Prisma** | 6.16.2 | ORM y manejo de base de datos |
| **SQLite** | - | Base de datos local |
| **Tailwind CSS** | 4.0 | Framework de estilos |
| **Lucide React** | 0.544.0 | Iconos modernos |

---

## 🚀 Instalación y Configuración

### Prerrequisitos

Asegúrate de tener instalado:
- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Git**

### 📥 Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/KalanOne/Glosario.git

# Navegar al directorio
cd Glosario
```

### 📦 Instalar Dependencias

```bash
# Instalar dependencias
npm install

# O con yarn
yarn install
```

### 🗄️ Configurar Base de Datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Abrir Prisma Studio para ver la base de datos
npx prisma studio
```

### 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos SQLite
DATABASE_URL="file:./dev.db"
```

### 🏃‍♂️ Ejecutar en Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# O con yarn
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

---

## 🚀 Despliegue

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KalanOne/Glosario)

1. **Fork** este repositorio
2. Conecta tu cuenta de **Vercel** con GitHub
3. Importa el proyecto desde tu fork
4. Configura las variables de entorno necesarias
5. ¡Despliega!

### Netlify

1. **Fork** este repositorio
2. Conecta tu cuenta de **Netlify** con GitHub
3. Selecciona el repositorio forkeado
4. Configura el comando de build: `npm run build`
5. Configura el directorio de publicación: `.next`
6. ¡Despliega!

### Docker

```bash
# Construir imagen
docker build -t glosario .

# Ejecutar contenedor
docker run -p 3000:3000 glosario
```

### Build Manual

```bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

---

## 📁 Estructura del Proyecto

```
Glosario/
├── 📁 prisma/
│   ├── 📄 schema.prisma      # Esquema de base de datos
│   └── 📁 migrations/        # Migraciones de BD
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 api/
│   │   │   └── 📁 terms/     # API endpoints
│   │   ├── 📄 globals.css    # Estilos globales
│   │   ├── 📄 layout.tsx     # Layout principal
│   │   └── 📄 page.tsx       # Página principal
│   └── 📁 generated/         # Cliente Prisma generado
├── 📄 package.json           # Dependencias y scripts
├── 📄 tailwind.config.js     # Configuración Tailwind
├── 📄 tsconfig.json          # Configuración TypeScript
└── 📄 README.md              # Este archivo
```

---

## 🎯 Uso

### Agregar un Término

1. Haz clic en **"Agregar Nuevo Término"**
2. Completa el formulario:
   - **Título**: Nombre del término
   - **Definición**: Explicación detallada
   - **Etiquetas**: Palabras clave separadas por comas
3. Haz clic en **"Guardar Término"**

### Buscar Términos

- Usa la **barra de búsqueda** para encontrar términos
- Aplica **filtros avanzados** para búsquedas específicas
- **Ordena** los resultados por fecha o alfabéticamente

### Gestionar Términos

- **Editar**: Haz clic en el ícono de lápiz
- **Eliminar**: Haz clic en el ícono de papelera
- **Navegar**: Usa la paginación para explorar todos los términos

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Aquí te explicamos cómo:

### 🐛 Reportar Bugs

1. Ve a [Issues](https://github.com/KalanOne/Glosario/issues)
2. Haz clic en **"New Issue"**
3. Selecciona **"Bug Report"**
4. Completa la plantilla con detalles

### ✨ Solicitar Features

1. Ve a [Issues](https://github.com/KalanOne/Glosario/issues)
2. Haz clic en **"New Issue"**
3. Selecciona **"Feature Request"**
4. Describe tu idea detalladamente

### 🔧 Contribuir Código

1. **Fork** el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y haz commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un **Pull Request**

---

## 📊 Roadmap

- [ ] 🌙 Modo oscuro
- [ ] 📱 App móvil (React Native)
- [ ] 🔐 Sistema de autenticación
- [ ] 📤 Exportar/Importar términos
- [ ] 🔍 Búsqueda con IA
- [ ] 🌐 Soporte multiidioma
- [ ] 📊 Dashboard con estadísticas
- [ ] 🔗 Compartir términos públicamente

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Alan Gardy** - [@KalanOne](https://github.com/KalanOne)

- 🌐 Website: [Tu sitio web]
- 📧 Email: [tu-email@ejemplo.com]
- 🐦 Twitter: [@tu_usuario]
- 💼 LinkedIn: [Tu perfil de LinkedIn]

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el increíble framework
- [Prisma](https://www.prisma.io/) por el excelente ORM
- [Tailwind CSS](https://tailwindcss.com/) por los estilos
- [Lucide](https://lucide.dev/) por los hermosos iconos
- [Vercel](https://vercel.com/) por el hosting gratuito

---

## 📈 Estadísticas

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=KalanOne&show_icons=true&theme=radical)

---

<div align="center">

**¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!**

[![GitHub stars](https://img.shields.io/github/stars/KalanOne/Glosario?style=social)](https://github.com/KalanOne/Glosario/stargazers)

*Hecho con ❤️ por [Alan Gardy](https://github.com/KalanOne)*

</div>
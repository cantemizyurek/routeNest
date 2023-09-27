# 🌐 routeNest

🛠 Easily structure and manage your Express.js routes using a directory-based approach. 🚀

## 📦 Installation

```bash
npm install routenest
```

## 🌟 Features

📂 Automatic Express route generation based on directory structure.

⚙️ Supports middlewares and RESTful methods.

🌲 Clean and organized route management using a tree structure.

## 📖 Usage

1. Import the library:

```javascript
import routeNest from 'routenest'
```

2. Organize your routes in a directory (e.g., /api):

```
/api
  /users
    get.js
    post.js
    /[id]
      get.js
      put.js
```

3. Initialize with your routes directory:

```javascript
const app = routeNest.initExpress('/api')

app.listen(3000)
```

💡 By default, routeNest looks into the /api directory, but you can customize the directory path by passing it to initExpress.

## 📘 API

`initExpress(directoryPath: string)`

🔍 Initializes the Express application with routes and middlewares defined in the provided directory.

**Parameters:**

- `directoryPath`: (Optional) The path to the directory containing your routes. Defaults to `/api`.

**Returns:**

- An initialized Express application.

## 🤝 Contributing

If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

## 📝 License

This project is licensed under the MIT License.

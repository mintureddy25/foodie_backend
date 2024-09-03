CREATE TABLE Customers (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    gender VARCHAR(10),
    age INTEGER
);

CREATE TABLE Eateries (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(20)
);

CREATE TABLE FoodCaterogies (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE FoodItems (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    eatery_id INTEGER,
    category_id INTEGER,
    FOREIGN KEY (eatery_id) REFERENCES Eateries(id),
    FOREIGN KEY (category_id) REFERENCES FoodCaterogies(id)
);

CREATE TABLE Orders (
    id INTEGER PRIMARY KEY,
    created_at DATETIME NOT NULL,
    status ENUM('Pending', 'Completed', 'Cancelled') NOT NULL,
    customer_id INTEGER,
    eatery_id INTEGER,
    FOREIGN KEY (customer_id) REFERENCES Customers(id),
    FOREIGN KEY (eatery_id) REFERENCES Eateries(id)
);

CREATE TABLE OrderFoodItemMapping (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    food_item_id INTEGER,
    FOREIGN KEY (order_id) REFERENCES Orders(id),
    FOREIGN KEY (food_item_id) REFERENCES FoodItems(id)
);

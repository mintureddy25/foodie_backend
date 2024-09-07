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
-- Inserting additional food items into the table

INSERT INTO food_items (id, name, description, price, eatery_id, category_id, status) VALUES
(5, 'vegetable biryani', 'fragrant rice with mixed vegetables', 600, 1, 3, 1),
(6, 'fish curry', 'spicy and tangy curry with fish', 750, 2, 4, 1),
(7, 'prawn masala', 'tender prawns in a rich masala sauce', 900, 2, 4, 1),
(8, 'paneer tikka', 'grilled paneer with spices', 500, 1, 5, 1),
(9, 'mushroom risotto', 'creamy risotto with mushrooms', 650, 3, 6, 1);


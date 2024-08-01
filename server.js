//import express and mongodb
const express =require('express');
const path =require('path');
const { MongoClient, ObjectId } =require('mongodb');

//Database connection address
const DB_ADDRESS ="mongodb+srv://admin:admin@cluster0.aclltls.mongodb.net";
const client =new MongoClient(DB_ADDRESS);
const connectDB =async () => {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');
        return true;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        return false;
    }
};

//create a new server
const server =express();
//defining the port
const PORT =5555;
//will recieve json data
server.use(express.json());
//default path for static files
server.use(express.static(path.join(__dirname, 'public')));

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });


//Function to start the server
const startServer =async () => {
    //check if db is connected
    const isConnected =await connectDB();
    if (isConnected) {
        // Define the routes
        server.post('/recipes', async (req, res) => {
            const recipe =req.body;
            console.log('Received recipe:', recipe);
            // Connect to the recipes collection in the database
            const collection =client.db('recipe_db').collection('recipes');

            try {
                
                // Send the inserted ID back to the client
                const result =await collection.insertOne(recipe);
                console.log('New recipe inserted with ID:', result.insertedId);
                res.status(200).json(result);
            } catch (err) {
                console.error('Error inserting recipe:', err);
                res.status(500).send('Error inserting recipe');
            }
        });

        server.get('/recipes', async (req, res) => {
            try{
                const collection =client.db('recipe_db').collection('recipes');
                const recipes =await collection.find().toArray();
                res.json(recipes);
            }
            catch (err) {
                console.error('Error fetching recipes:', err);
                res.status(500).send('Error fetching recipes');
            }
        });

        server.get('/recipes/:id', async (req, res) => {
            const id=req.params.id;
            const collection =client.db('recipe_db').collection('recipes');
            try{
                const recipe = await collection.findOne({ _id: new ObjectId(id) });
                res.json(recipe);
            }
            catch (err) {
                console.error('Error fetching recipe:', err);
                res.status(500).send('Error fetching recipe');
            }
        });

        server.put('/recipes/:id', async (req, res) => {
            const id =req.params.id;
            const updatedRecipe =req.body;
            console.log('Received updated recipe:', updatedRecipe);

            const collection =client.db('recipe_db').collection('recipes');
            try{
                // Update the recipe in the database with the provided ID
                const result =await collection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedRecipe }
                );
                res.json(result);
            }
            catch (err) {
                console.error('Error updating recipe:', err);
                res.status(500).send('Error updating recipe');
            }

        });

        server.delete('/recipes/:id', async (req, res) => {
            const id =req.params.id;
            const collection =client.db('recipe_db').collection('recipes');
            try{
                // Delete the recipe in the database with the provided ID
                const result =await collection.deleteOne({ _id: new ObjectId(id) });
                res.json(result);
            }
            catch (err) {
                console.error('Error deleting recipe:', err);
                res.status(500).send('Error deleting recipe');
            }

        });


        //Listen to the server
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } else {
        console.error('Server could not start because database connection failed.');
    }
};

// Start the server
startServer();
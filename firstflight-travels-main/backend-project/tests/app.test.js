describe('App', () => {
    it('should respond with a 200 status code on the root path', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });

    it('should create an item and respond with a 201 status code', async () => {
        const newItem = { name: 'Test Item' };
        const response = await request(app).post('/items').send(newItem);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(newItem.name);
    });

    it('should return all items with a 200 status code', async () => {
        const response = await request(app).get('/items');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
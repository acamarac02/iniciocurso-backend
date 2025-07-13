describe('Test prueba', () => {
    it('Revisar que 1+1=2', () => {
        expect(1 + 1).toBe(2);
    })

    it('Revisar que 1+1!=3', () => {
        expect(1 + 1).not.toBe(3);
    })
})
class RandomCodeGenerator {
  generateUniqueClassCode = () => {
    const prefix = "CLASS";
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log(`${prefix}-${randomPart}`);
    return `${prefix}-${randomPart}`;
  };
}
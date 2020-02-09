declare module "*.md";
declare module "*!txt" {
    const content: string;
    export default content;
}

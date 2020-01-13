
function scalarizeObject(obj : any): any {
}
export function serializeInput(data: any): any {
    var modifiedData = {};
    Object.keys(data).forEach(key => {
    });
};

export function deglobifyId(id: string) : number {
    return parseInt(atob(id).split(":")[1]);
}

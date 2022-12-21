export const rationApi = () => `http://localhost:5000/ration`;

//type:get,getOne,add,delete,modify
export function ration(type, data) {
  switch (type) {
    case "get":
      fetch(rationApi(), {
        mode: "no-cors",
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
      break;
    case "getOne":
    case "add":
    case "delete":
    case "modify":
    default:
  }
}

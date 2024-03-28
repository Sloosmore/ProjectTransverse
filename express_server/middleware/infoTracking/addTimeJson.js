function replaceTimeWithCurrent(item, newTime) {
  console.log("time being added", newTime);
  if (Array.isArray(item)) {
    // If item is an array, process each element recursively
    return item.map((element) => replaceTimeWithCurrent(element, newTime));
  } else if (item !== null && typeof item === "object") {
    // If item is an object, copy properties and process them
    let newItem = {};
    Object.keys(item).forEach((key) => {
      if (key === "attrs") {
        // Handle 'attrs' object
        newItem.attrs = { ...item.attrs };
        if (newItem.attrs.time === null || newItem.attrs.time === undefined) {
          // If 'time' is null or undefined, set it to newTime
          newItem.attrs.time = newTime;
        }
      } else {
        // Process other properties recursively
        newItem[key] = replaceTimeWithCurrent(item[key], newTime);
      }
    });
    return newItem;
  } else {
    // Return the item as-is if it's not an object or array
    return item;
  }
}

module.exports = { replaceTimeWithCurrent };

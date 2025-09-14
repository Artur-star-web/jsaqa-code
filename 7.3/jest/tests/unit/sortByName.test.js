const sorting = require("../../app");

describe("Books names test suit", () => {
  it("Books names should be sorted in ascending order", () => {
    expect(
      sorting.sortByName([
        "Гарри Поттер",
        "Властелин Колец",
        "Волшебник изумрудного города",
      ])
    ).toEqual([
      "Властелин Колец",
      "Волшебник изумрудного города",
      "Гарри Поттер",
    ]);
  });

  it("Should return empty array for empty input", () => {
    expect(sorting.sortByName([])).toEqual([]);
  });

  it("Should return same array for single element", () => {
    expect(sorting.sortByName(["Одна книга"])).toEqual(["Одна книга"]);
  });

  it("Should handle already sorted array", () => {
    expect(sorting.sortByName(["А", "Б", "В"])).toEqual(["А", "Б", "В"]);
  });

  it("Should handle reverse sorted array", () => {
    expect(sorting.sortByName(["В", "Б", "А"])).toEqual(["А", "Б", "В"]);
  });

  it("Should handle identical values", () => {
    expect(sorting.sortByName(["А", "А", "А"])).toEqual(["А", "А", "А"]);
  });

  it("Should cover return -1 branch (nameA < nameB)", () => {
  expect(
    sorting.sortByName([
      "Яблоко",
      "Апельсин"
    ])
  ).toEqual([
    "Апельсин", 
    "Яблоко"  
  ]);
});

  it("Should thoroughly test sort function", () => {
    const result = sorting.sortByName([
      "Z", "A", "M", "B", "Z", "A"
    ]);
    
    expect(result).toEqual(["A", "A", "B", "M", "Z", "Z"]);
  });

  it("Should handle mixed case and unicode characters", () => {
    expect(
      sorting.sortByName([
        "яблоко", "АПЕЛЬСИН", "банан", "Вишня"
      ])
    ).toEqual([
      "АПЕЛЬСИН", "банан", "Вишня", "яблоко"  
    ]);
  });
});
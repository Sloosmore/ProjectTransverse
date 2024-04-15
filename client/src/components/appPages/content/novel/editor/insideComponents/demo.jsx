import { useCurrentEditor } from "@tiptap/react";
import React, { useEffect } from "react";

const DemoJson = ({}) => {
  const { editor } = useCurrentEditor();

  const append_array = [
    [
      {
        type: "heading",
        attrs: {
          time: {
            time: "12994",
          },
          level: 2,
        },
        content: [
          {
            type: "text",
            text: "Generate Real Time Comprehensive Notes",
          },
        ],
      },
      {
        type: "bulletList",
        attrs: {
          tight: true,
          time: {
            time: "12994",
          },
        },
        content: [
          {
            type: "listItem",
            attrs: {
              time: {
                time: "12994",
              },
            },
            content: [
              {
                type: "paragraph",
                attrs: {
                  time: {
                    time: "12994",
                  },
                },
                content: [
                  {
                    type: "text",
                    text: "You tell us the format and style",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            attrs: {
              time: {
                time: "12994",
              },
            },
            content: [
              {
                type: "paragraph",
                attrs: {
                  time: {
                    time: "12994",
                  },
                },
                content: [
                  {
                    type: "text",
                    text: "We take care of the rest",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            attrs: {
              time: {
                time: "12994",
              },
            },
            content: [
              {
                type: "paragraph",
                attrs: {
                  time: {
                    time: "12994",
                  },
                },
                content: [
                  {
                    type: "text",
                    text: "Check whenever you miss something!",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    [
      {
        type: "heading",
        attrs: {
          time: {
            time: "12994",
          },
          level: 2,
        },
        content: [
          {
            type: "text",
            text: "Or Create Guided Notes",
          },
        ],
      },
      {
        type: "paragraph",
        attrs: {
          time: {
            time: "12994",
          },
        },
        content: [
          {
            type: "text",
            marks: [
              {
                type: "bold",
              },
            ],
            text: "Benefits Of Guided Notes:",
          },
        ],
      },
      {
        type: "bulletList",
        attrs: {
          tight: true,
          time: 51720,
        },
        content: [
          {
            type: "listItem",
            attrs: {
              time: 51720,
            },
            content: [
              {
                type: "paragraph",
                attrs: {
                  time: 51720,
                },
              },
            ],
          },
          {
            type: "listItem",
            attrs: {
              time: 51720,
            },
            content: [
              {
                type: "paragraph",
                attrs: {
                  time: 51720,
                },
                content: [
                  {
                    type: "text",
                    marks: [
                      {
                        type: "bold",
                      },
                    ],
                    text: " ",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    [
      {
        type: "heading",
        attrs: {
          time: 51720,
          level: 2,
        },
        content: [
          {
            type: "text",
            text: "Don't Forget Live Diagrams!",
          },
        ],
      },
      {
        type: "image",
        attrs: {
          time: null,
          src: "https://zkvwhjbomivobvvdriwt.supabase.co/storage/v1/object/public/uploaded_images/daf206a6-6f1a-485e-b523-dfc5aa87a7fa",
          alt: null,
          title: null,
          width: null,
          height: null,
        },
      },
    ],
  ];

  const append_array_diagram = [
    [
      {
        type: "image",
        attrs: {
          time: null,
          src: "https://zkvwhjbomivobvvdriwt.supabase.co/storage/v1/object/public/diagrams/diagrams/8fccb868-f7a2-4daa-a75b-9fe5e671cdbe/sequence-diagra.png",
          alt: null,
          title: null,
          width: 1300,
          height: null,
          class: "center", // Add this line
        },
      },
    ],
    [
      {
        type: "image",
        attrs: {
          time: null,
          src: "https://zkvwhjbomivobvvdriwt.supabase.co/storage/v1/object/public/diagrams/diagrams/6816e506-2cc9-470b-be81-7eb697456fae/sequence-diagra.png",
          alt: null,
          title: null,
          width: 1300,
          height: null,
          class: "center", // Add this line
        },
      },
    ],
    [
      {
        type: "image",
        attrs: {
          time: null,
          src: "https://zkvwhjbomivobvvdriwt.supabase.co/storage/v1/object/public/diagrams/diagrams/cda4bf6e-f9c1-4db0-8525-0b155b00a594/sequence-diagra.png",
          alt: null,
          title: null,
          width: 1300,
          height: null,
          class: "center", // Add this line
        },
      },
    ],
  ];

  const append_array_note = [
    [
      {
        type: "heading",
        attrs: {
          time: null,
          level: 1,
        },
        content: [
          {
            type: "text",
            text: "Momentum",
          },
        ],
      },
      {
        type: "paragraph",
        attrs: {
          time: {
            time: null,
          },
        },
        content: [
          {
            type: "text",
            text: "Momentum is a fundamental concept in physics that describes the quantity of motion an object possesses. It is the product of an object's mass and velocity.",
          },
        ],
      },
    ],
    [
      {
        type: "heading",
        attrs: {
          time: null,
          level: 2,
        },
        content: [
          {
            type: "text",
            text: "Formula (",
          },
          {
            type: "text",
            marks: [
              {
                type: "textStyle",
                attrs: {
                  color: "rgb(171, 178, 191)",
                },
              },
            ],
            text: "p = mv",
          },
          {
            type: "text",
            text: ")",
          },
        ],
      },
      {
        type: "bulletList",
        attrs: {
          tight: true,
          time: null,
        },
        content: [
          {
            type: "listItem",
            attrs: {
              time: null,
            },
            content: [
              {
                type: "paragraph",
                attrs: {
                  time: {
                    time: null,
                  },
                },
                content: [
                  {
                    type: "text",
                    text: " ",
                  },
                  {
                    type: "text",
                    marks: [
                      {
                        type: "code",
                      },
                    ],
                    text: "p",
                  },
                  {
                    type: "text",
                    text: " is the momentum",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            attrs: {
              time: null,
            },
            content: [
              {
                type: "paragraph",
                attrs: {
                  time: {
                    time: null,
                  },
                },
                content: [
                  {
                    type: "text",
                    text: " ",
                  },
                  {
                    type: "text",
                    marks: [
                      {
                        type: "code",
                      },
                    ],
                    text: "m",
                  },
                  {
                    type: "text",
                    text: " is the mass of the object",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            attrs: {
              time: null,
            },
            content: [
              {
                type: "paragraph",
                attrs: {
                  time: {
                    time: null,
                  },
                },
                content: [
                  {
                    type: "text",
                    text: " ",
                  },
                  {
                    type: "text",
                    marks: [
                      {
                        type: "code",
                      },
                    ],
                    text: "v",
                  },
                  {
                    type: "text",
                    text: " is the velocity of the object",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    [
      {
        type: "heading",
        attrs: {
          time: null,
          level: 2,
        },
        content: [
          {
            type: "text",
            text: "Conservation of Momentum",
          },
        ],
      },
      {
        type: "paragraph",
        attrs: {
          time: {
            time: null,
          },
        },
        content: [
          {
            type: "text",
            text: "One of the most important principles related to momentum is the conservation of momentum. This principle states that the total momentum of a closed system remains constant, provided no external forces act on the system. In other words, momentum is neither created nor destroyed, but only transferred between objects during collisions or interactions.",
          },
        ],
      },
    ],
    [
      {
        type: "heading",
        attrs: {
          time: null,
          level: 2,
        },
        content: [
          {
            type: "text",
            text: "Collisions",
          },
        ],
      },
      {
        type: "paragraph",
        attrs: {
          time: {
            time: null,
          },
        },
        content: [
          {
            type: "text",
            text: "Momentum plays a crucial role in understanding collisions between objects. There are two main types of collisions:",
          },
        ],
      },
      {
        type: "paragraph",
        attrs: {
          time: {
            time: null,
          },
        },
        content: [
          {
            type: "text",
            text: "1. ",
          },
          {
            type: "text",
            marks: [
              {
                type: "bold",
              },
            ],
            text: "Elastic collisions",
          },
          {
            type: "text",
            text: ": In an elastic collision, both momentum and kinetic energy are conserved. The total momentum before and after the collision remains the same, and the kinetic energy is also conserved.",
          },
        ],
      },
      {
        type: "paragraph",
        attrs: {
          time: {
            time: null,
          },
        },
        content: [
          {
            type: "text",
            text: "2. ",
          },
          {
            type: "text",
            marks: [
              {
                type: "bold",
              },
            ],
            text: "Inelastic collisions",
          },
          {
            type: "text",
            text: ": In an inelastic collision, momentum is conserved, but kinetic energy is not. Some of the kinetic energy is converted into other forms of energy, such as heat or sound, during the collision.",
          },
        ],
      },
    ],
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey) {
        // Run your function here
        if (editor) {
          // Assuming `appendJSON` is a command you've added to your TipTap editor
          for (let i = 0; i < append_array_note.length; i++) {
            setTimeout(() => {
              console.log(Array.isArray(append_array_note[i]));
              editor
                .chain()
                .focus()
                .appendJSON({ content: append_array_note[i] })
                .run();
            }, 300 * (i + 1));
          }
        }
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default DemoJson;

//&& mode === "note"

//https://zkvwhjbomivobvvdriwt.supabase.co/storage/v1/object/public/diagrams/diagrams/6816e506-2cc9-470b-be81-7eb697456fae/sequence-diagra.png
//https://zkvwhjbomivobvvdriwt.supabase.co/storage/v1/object/public/diagrams/diagrams/dd225e9e-475b-4f4e-a39a-9fab34bb7d24/sequence-diagra.png
//https://zkvwhjbomivobvvdriwt.supabase.co/storage/v1/object/public/diagrams/diagrams/b34e6648-ac62-46ba-8429-b50cb1282839/sequence-diagra.png

//https://zkvwhjbomivobvvdriwt.supabase.co/storage/v1/object/public/diagrams/diagrams/b7cc2122-2699-4155-a4fc-90445f882c87/sequence-diagra.png
//

//https://zkvwhjbomivobvvdriwt.supabase.co/storage/v1/object/public/diagrams/diagrams/21081d2f-a003-46b2-98af-379fbd9cc73f/sequence-diagra.png

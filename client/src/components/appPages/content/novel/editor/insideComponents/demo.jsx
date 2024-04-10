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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey) {
        // Run your function here
        if (editor) {
          // Assuming `appendJSON` is a command you've added to your TipTap editor
          for (let i = 0; i < append_array.length; i++) {
            setTimeout(() => {
              console.log(Array.isArray(append_array[i]));
              editor
                .chain()
                .focus()
                .appendJSON({ content: append_array[i] })
                .run();
            }, 1000 * (i + 1));
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

import autogen
import os
import sys
from autogen.agentchat.contrib.gpt_assistant_agent import GPTAssistantAgent

task = sys.argv[1]


config_list = [

        {
            'model': 'gpt-3.5-turbo',
            'api_key': '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',
        },

]

"""llm_config = {
 "request_timeout": 600,
        "seed": 42,  # seed for caching and reproducibility
        "config_list": config_list,  # a list of OpenAI API configurations
        "temperature": 0,  # temperature for sampling
    }"""

assistant = GPTAssistantAgent(
name="assistant",
            llm_config={
            "config_list": config_list,
            "assistant_id": 'asst_uHSrHyxbKud64mmKstVY7YMb',
            "tools": [
                {
                    "type": "code_interpreter"
                }
            ],
        })

    # create a UserProxyAgent instance named "user_proxy"
user_proxy = autogen.UserProxyAgent(
        name="user_proxy",
        human_input_mode="NEVER",
        max_consecutive_auto_reply=2,
        is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
        code_execution_config={
            "work_dir": "files/docs",
            "use_docker": False,  # set to True or image name like "python:3" to use docker
        },
        # llm_config=llm_config
    )
    # the assistant receives a message from the user_proxy, which contains the task description

user_proxy.initiate_chat(
        assistant,
        message=task,
    )
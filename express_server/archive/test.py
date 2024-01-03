import os
from openai import OpenAI
from dotenv import load_dotenv
from autogen import config_list_from_json, UserProxyAgent, AssistantAgent
from autogen.agentchat.contrib.gpt_assistant_agent import GPTAssistantAgent

'''def transcribe(name):
    #filename = '1dba9797-187b-4692-be9a-119e883cc345'

#transcribe(filename)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    try:


        #transcribe
        audio_path = os.path.join(script_dir, f'../../files/audiologs/{name}.webm')
        
        
        audio_file = open(audio_path, "rb")
        result = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format='text'
        )
    
        
        #delete
        #os.remove(audio_path)
        print(result)

        
        #append
        transcript_path = os.path.join(script_dir, f'../../files/transcripts/test.txt')
    
        with open(transcript_path, "a") as file:  # append mode
            file.write(f"{result} \n")

    except Exception as e:
        raise e

'''

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI (api_key=api_key)

config_list = [{
        "model": "gpt-4-1106-preview",
        "api_key": "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"}]



gpt_assistant = AssistantAgent(
    name='"assistant"',
    system_message = """
    Develop a Python script that translates the structured and styled input content into a Word document or a PowerPoint presentation. The script should interpret the input, which is formatted with specific tags and styles, and use Python libraries such as python-docx for Word documents and python-pptx for PowerPoint presentations. The script must:

    Analyze the Input Format: Determine if the input is structured for a Word document (<doc> tags) or a PowerPoint presentation (<presentation> tags).

   The title of the document will be enclosed in a comment. When writing the file use this name.

    Extract and Apply Styles: Read the style settings from the <head> tag and prepare to apply these as default styles in the document or presentation. Handle style overrides defined within specific content sections.

    For Word Document Generation (python-docx):

    Create paragraphs for each <paragraph> tag in the document.
    Apply specific styles from <span> tags to the text within paragraphs.
    Treat content within <title> tags as headings.
    Utilize sentence type tags (e.g., <sentence type='topic'>) to format sentences appropriately.

    For PowerPoint Presentation Generation (python-pptx):

    Create a new slide for each <slide> tag.
    Use content within <title> tags for slide titles.
    For each <content> section, add text or bullet points as indicated by <bullet> tags.
    Apply inline styles specified within the slide content.
    Include Error Handling: The script should handle cases where tags are missing, incomplete, or if there's incompatible formatting. It should provide clear error messages or fallbacks in such scenarios.

    Include all document: Any content inside the tags should be included inside the python script when the document is generated. Do not leave any content out. 

    Generate the Final Output:

    Save the translated content as a .docx or .pptx file using the comment at the beginning of the input. Ensure the final document or presentation is well-formatted, adhering to the structured input. The Python script should be flexible and robust enough to handle various styles and structures as defined in the GPT API output. It should accurately reflect the intended formatting and content organization in the final Word or PowerPoint file. DO NOT use placeholders for content from the input. When the script runs it should make the WHOLE document content included and not rely on someone using the script in the future.

    Reply "TERMINATE" in the end when everything is done.
    """,
    
    llm_config={
        "config_list": config_list,
    })

user_proxy = UserProxyAgent(
    name="user_proxy",
    code_execution_config={
        "work_dir": "coding"
    },
    
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=3,
)


message_gpt3 = """
<!-- filename: Puppies.docx -->
<doc>
<title>Puppies</title>
<paragraph><span style="{'bold': true, 'font': 'Times New Roman', 'fontSize': 12}">Introduction</span>: <sentence type='topic'>Puppies are delightful companions that bring joy and warmth to countless households.</sentence> Their playful and loyal nature make them beloved pets for people of all ages.</paragraph>
<paragraph>Puppies, often known for their boundless energy and affectionate behavior, have been a part of human history for centuries. From being working dogs to cherished family members, puppies have always held a special place in society.</paragraph>
<paragraph>One of the remarkable aspects of puppies is their ability to form strong emotional bonds with their human caregivers. This bond goes beyond just being a pet and owner; it evolves into a genuine friendship built on trust and love.</paragraph>
<paragraph>Furthermore, the diverse breeds of puppies offer a wide range of characteristics and temperaments, catering to different preferences and lifestyles. Whether it's the protective nature of a German Shepherd, the intelligence of a Border Collie, or the playful demeanor of a Labrador Retriever, there's a puppy for everyone.</paragraph>
<paragraph><span style="{'bold': true, 'font': 'Times New Roman', 'fontSize': 12}">Conclusion</span>: <sentence type='conclusion'>In conclusion, puppies enrich our lives in numerous ways, providing companionship, love, and unending joy. Their impact on human well-being is undeniable, making them not just pets, but valued members of our families.</sentence></paragraph>
</doc>
"""

message_gpt4 = '''
<!-- filename: Puppies_HELP_ME.docx --><head>{"bold": false, "italicised": false, "underline": false, "highlight": "none", "color": "black", "font": "Times New Roman", "fontSize": 12, "alignment": "justified"}</head><doc> <title>The Joyful World of Puppies</title>
<paragraph><span style="{"bold": true, "font": "Times New Roman", "fontSize": 12}">Introduction</span>: <sentence type="topic">The presence of puppies is synonymous with boundless energy, unconditional love, and unwavering companionship.</sentence> From their earliest moments, puppies captivate us with their innocent expressions and playful antics. This essay explores the development stages of puppies, their socialization needs, and the joy they bring into human lives.</paragraph>
 
<paragraph><span style="{"bold": false, "font": "Times New Roman", "fontSize": 12}">Embarking on Life</span>: <sentence type="topic">The journey of a puppy begins even before they open their eyes.</sentence> Born blind and deaf, puppies rely entirely on their mother for warmth and nutrition. During the first few weeks, rapid development takes place as they start to explore their surroundings, develop their senses, and establish bonds with their littermates and human caregivers.</paragraph>
 
<paragraph><span style="{"bold": false, "font": "Times New Roman", "fontSize": 12}">Growth and Socialization</span>: <sentence type="topic">As puppies grow, they undergo significant changes that prepare them for the world ahead.</sentence> Between three to twelve weeks of age, they experience a socialization period which is critical for their behavioral development. Positive interactions with people, other animals, and various environments during this phase are crucial for raising well-adjusted adult dogs. Moreover, this is the time when they begin basic training, learning commands such as "sit," "stay," and "come."</paragraph>
 
<paragraph><span style="{"bold": false, "font": "Times New Roman", "fontSize": 12}">The Bond with Humans</span>: <sentence type="topic">The bond formed between puppies and their owners is one of the most extraordinary aspects of the human-animal connection.</sentence> As pack animals, dogs have an innate ability to sense human emotions, often acting as emotional anchors. Raising a puppy offers both challenges and immense rewards, contributing to the emotional and physical well-being of their owners through companionship and love.</paragraph>
 
<paragraph><span style="{"bold": false, "font": "Times New Roman", "fontSize": 12}">Health and Care</span>: <sentence type="topic">Ensuring the health and happiness of a puppy requires dedication and knowledge.</sentence> This includes providing a balanced diet, regular exercise, and routine veterinary care. Vaccinations, spaying and neutering, and preventive measures against parasites are all part of responsible puppy care. Educating oneself about the specific needs of the puppy"s breed is also vital to offer the best quality of life.</paragraph>
 
<paragraph><span style="{"bold": true, "font": "Times New Roman", "fontSize": 12}">Conclusion</span>: <sentence type="conclusion">Puppies not only bring joy and liveliness into our homes but also teach us about responsibility, compassion, and unconditional love.</sentence> As they evolve from helpless bundles of fur to loyal and devoted companions, we, in turn, grow alongside them. The enriching experience of raising a puppy is one that shapes the lives of all who are fortunate enough to undertake it.</paragraph>
 
</doc>
'''


user_proxy.initiate_chat(gpt_assistant, message=message_gpt4)



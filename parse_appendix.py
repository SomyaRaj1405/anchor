import zipfile, xml.etree.ElementTree as ET

zf = zipfile.ZipFile('docs/Anchor_Work_Aditya_Core_Engines.docx')
tree = ET.fromstring(zf.read('word/document.xml'))
text = ''.join(tree.itertext())

idx = text.find('resume_preview')
while idx != -1:
    print('---')
    print(text[idx-50:idx+300])
    idx = text.find('resume_preview', idx + 1)

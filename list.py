import os
import sys
def ListFilesToTxt(dir,file,wildcard,recursion):
    exts = wildcard.split(" ")
    for root, subdirs, files in os.walk(dir):
        for name in files:
            for ext in exts:
                if(name.endswith(ext)):
                  file.write(name + "\n")
                  break
        if(not recursion):
            break
def Test():
  dir = path
  outfile="imageNameList.txt"
  wildcard = ".jpg .jpeg .PNG"

  file = open(outfile,"wb")
  if not file:
    print ("cannot open the file %s for writing" % outfile)
  ListFilesToTxt(dir,file,wildcard, 1)

  file.close()
path = "data/"
Test()

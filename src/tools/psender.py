#!/usr/bin/env python
# coding=utf-8
import sys

def tool1(args):
    # 工具1的具体实现
    return f"tool 1 result: {args}"

def tool2(args):
    # 工具2的具体实现
    return f"tool 2 result: {args}"

if __name__ == "__main__":
    tool_name = sys.argv[1]
    args = sys.argv[2:]
    print(f"name: {tool_name}")
    
    # 根据工具名称调用对应函数
    if tool_name == "tool1":
        result = tool1(args)
    elif tool_name == "tool2":
        result = tool2(args)
    else:
        result = "None"
        
    print(result)
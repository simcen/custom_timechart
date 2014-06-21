# Custom Timecharts
- Author: Simon Balz <simon@balz.me>

## Changelog
- **2014-06-19** sba - v1.0 released
- **2014-06-21** sba - v1.1 released

## Release Notes
- **v1.0** Initial release
- **v1.1** Added examples and explanation for token usage

## Installation 
Install the app as a normal Splunk app. Copy autodiscover.js from appserver/statc to your app's appserver/static. Restart splunk.

## general Information
- Example dashboard is included 
- There are some necessary options:
    - managerid: 		ID of the Search manager            
    - categoryField:	Name of a Splunk field containing the series             
    - valueField:		Name of a Splunk field containing the series value     
    - span:				Span between ticks in miliseconds
    - unitLabel:		Suffix for series values
    - valueLabel:		Label for values             

## Prerequisites, requirements
- n/a

## Indextime Configurations
- n/a

## Searchtime Configurations
- n/a

## Source-specific inputs configurations
- n/a

## required Indexes
- n/a

## TODO
- Automatically extract span from the search
- Better documentation
- Support for different chart types for each series